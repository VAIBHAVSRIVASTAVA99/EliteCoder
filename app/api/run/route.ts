import { NextRequest, NextResponse } from "next/server";

type RunResult = { output: string; error: string; success: boolean };

type JDoodleMap = { language: string; versionIndex: string };

function mapToJDoodle(language: string): JDoodleMap | null {
  const lang = language.toLowerCase();
  switch (lang) {
    case "javascript":
    case "js":
      return { language: "nodejs", versionIndex: "0" };
    case "python":
    case "python3":
      return { language: "python3", versionIndex: "0" };
    case "java":
      return { language: "java", versionIndex: "0" };
    case "cpp":
      return { language: "cpp17", versionIndex: "0" };
    case "c":
      return { language: "c", versionIndex: "0" };
    case "go":
      return { language: "go", versionIndex: "0" };
    default:
      return null;
  }
}

async function runWithJDoodle(code: string, language: string, input: string): Promise<RunResult> {
  const clientId = process.env.JDOODLE_CLIENT_ID;
  const clientSecret = process.env.JDOODLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return { output: "", error: "JDoodle credentials not configured", success: false };
  }
  const mapped = mapToJDoodle(language);
  if (!mapped) {
    return { output: "", error: `Unsupported language: ${language}`, success: false };
  }
  const payload = {
    clientId,
    clientSecret,
    script: code,
    stdin: input,
    language: mapped.language,
    versionIndex: mapped.versionIndex,
  };
  const res = await fetch("https://api.jdoodle.com/v1/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const message = (data?.error as string) || res.statusText || "Run failed";
    return { output: "", error: String(message), success: false };
  }
  const output = String((data.output as string) ?? "");
  return { output: output.trim(), error: "", success: true };
}

async function runRemote(code: string, language: string, input: string): Promise<RunResult> {
  const runnerUrl = process.env.RUNNER_API_URL;
  const runnerKey = process.env.RUNNER_API_KEY;
  if (!runnerUrl) {
    return { output: "", error: "Remote runner not configured", success: false };
  }
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (runnerKey) headers["Authorization"] = `Bearer ${runnerKey}`;
  const res = await fetch(runnerUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({ language, code, stdin: input }),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const message = (data?.error as string) || res.statusText || "Run failed";
    return { output: "", error: String(message), success: false };
  }
  const output = String((data.output as string) ?? (data.stdout as string) ?? "");
  const error = String((data.error as string) ?? (data.stderr as string) ?? "");
  return { output: output.trim(), error: error.trim(), success: !error.trim() };
}

export async function POST(req: NextRequest) {
  try {
    const { code, language, input } = (await req.json()) as { code: string; language: string; input?: string };
    if (!code || !language) {
      return NextResponse.json({ error: "Code and language are required" }, { status: 400 });
    }

    const modeRaw = process.env.CODE_RUN_MODE?.toLowerCase();
    const stdin = typeof input === "string" ? input : "";

    let result: RunResult;

    if (modeRaw === "jdoodle" || !modeRaw || modeRaw === "auto") {
      const jd = await runWithJDoodle(code, language, stdin);
      if (jd.success || modeRaw === "jdoodle") {
        result = jd;
      } else {
        result = await runRemote(code, language, stdin);
      }
    } else if (modeRaw === "remote") {
      result = await runRemote(code, language, stdin);
    } else {
      const jd = await runWithJDoodle(code, language, stdin);
      result = jd.success ? jd : await runRemote(code, language, stdin);
    }

    return NextResponse.json({ output: result.output, error: result.error, success: result.success });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 