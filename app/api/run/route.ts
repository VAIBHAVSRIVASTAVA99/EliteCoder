import { NextRequest, NextResponse } from "next/server";
import { exec, spawn, ChildProcessWithoutNullStreams } from "child_process";
import { promisify } from "util";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { code, language, input } = await req.json();
    if (!code || !language) {
      return NextResponse.json({ error: "Code and language are required" }, { status: 400 });
    }
    const dangerousPatterns = [
      /require\s*\(\s*['"]fs['"]\s*\)/,
      /require\s*\(\s*['"]child_process['"]\s*\)/,
      /import\s+.*\s+from\s+['"]fs['"]/,
      /import\s+.*\s+from\s+['"]child_process['"]/,
      /eval\s*\(/,
      /process\./,
      /__dirname/,
      /__filename/,
      /os\./,
      /exec\s*\(/,
      /spawn\s*\(/,
      /system\s*\(/,
      /popen\s*\(/,
      /subprocess\./,
      /import\s+os/,
      /import\s+subprocess/,
      /import\s+sys/,
      /sys\./,
      /Runtime\./,
      /ProcessBuilder/,
      /Process\./,
      /exec\s*\(/,
      /system\s*\(/,
    ];
    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        return NextResponse.json({ 
          error: "Code contains potentially dangerous operations and cannot be executed for security reasons." 
        }, { status: 403 });
      }
    }
    let output = "";
    let error = "";
    try {
      const timestamp = Date.now();
      const filename = `code_${timestamp}`;
      const tempDir = tmpdir();
      let filePath = "";
      let args: string[] = [];
      let execFilePath = "";
      const cleanupFiles: string[] = [];
      let runWithSpawn = false;
      switch (language) {
        case "javascript":
        case "js": {
          filePath = join(tempDir, `${filename}.js`);
          writeFileSync(filePath, code);
          execFilePath = "node";
          args = [filePath];
          runWithSpawn = true;
          cleanupFiles.push(filePath);
          break;
        }
        case "python":
        case "python3": {
          filePath = join(tempDir, `${filename}.py`);
          writeFileSync(filePath, code);
          execFilePath = "python";
          args = [filePath];
          runWithSpawn = true;
          cleanupFiles.push(filePath);
          break;
        }
        case "java": {
          filePath = join(tempDir, `${filename}.java`);
          writeFileSync(filePath, code);
          const className = filename.charAt(0).toUpperCase() + filename.slice(1);
          await execAsync(`cd "${tempDir}" && javac "${filename}.java"`);
          execFilePath = "java";
          args = ["-cp", tempDir, className];
          runWithSpawn = true;
          cleanupFiles.push(filePath, join(tempDir, `${className}.class`));
          break;
        }
        case "cpp": {
          filePath = join(tempDir, `${filename}.cpp`);
          writeFileSync(filePath, code);
          const cppOutput = join(tempDir, `${filename}.exe`);
          await execAsync(`g++ "${filePath}" -o "${cppOutput}"`);
          execFilePath = cppOutput;
          args = [];
          runWithSpawn = true;
          cleanupFiles.push(filePath, cppOutput);
          break;
        }
        case "c": {
          filePath = join(tempDir, `${filename}.c`);
          writeFileSync(filePath, code);
          const cOutput = join(tempDir, `${filename}.exe`);
          await execAsync(`gcc "${filePath}" -o "${cOutput}"`);
          execFilePath = cOutput;
          args = [];
          runWithSpawn = true;
          cleanupFiles.push(filePath, cOutput);
          break;
        }
        case "go": {
          filePath = join(tempDir, `${filename}.go`);
          writeFileSync(filePath, code);
          execFilePath = "go";
          args = ["run", filePath];
          runWithSpawn = true;
          cleanupFiles.push(filePath);
          break;
        }
        default:
          return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 });
      }
      if (runWithSpawn) {
        output = await new Promise((resolve, reject) => {
          const child: ChildProcessWithoutNullStreams = spawn(execFilePath, args, {
            timeout: 10000,
            windowsHide: true,
          });
          let stdout = "";
          let stderr = "";
          if (input) {
            child.stdin.write(input);
          }
          child.stdin.end();
          child.stdout.on("data", (data: Buffer) => {
            stdout += data.toString();
          });
          child.stderr.on("data", (data: Buffer) => {
            stderr += data.toString();
          });
          child.on("close", () => {
            if (stderr) {
              reject(stderr);
            } else {
              resolve(stdout);
            }
          });
          child.on("error", (err: unknown) => {
            reject(err);
          });
        });
      }
      for (const f of cleanupFiles) {
        try { unlinkSync(f); } catch {}
      }
    } catch (execError: unknown) {
      error = execError instanceof Error ? execError.message : "Execution failed";
      if (typeof execError === "object" && execError && "stdout" in execError) output = (execError as { stdout?: string }).stdout || output;
      if (typeof execError === "object" && execError && "stderr" in execError) error = (execError as { stderr?: string }).stderr || error;
    }
    return NextResponse.json({ 
      output: typeof output === 'string' ? output.trim() : '', 
      error: error.trim(),
      success: !error.trim()
    });
  } catch (err: unknown) {
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 