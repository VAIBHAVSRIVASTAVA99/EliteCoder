"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Modal } from "@/components/ui/modal"
import { Code, Play, FileText, Zap, User, LogOut, PanelLeftClose, PanelLeft, Terminal } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"

interface SavedCode {
  _id: string;
  code: string;
  language: string;
  filename: string;
  updatedAt: string;
}

export default function EditorPage() {
  const defaultCode = {
    javascript: `// Welcome to Elite Code Editor
function powerUp() {
  console.log("Reaching elite level!");
  return power * 1000;
}

// Your legendary code starts here
powerUp();`,
    python: `# Welcome to Elite Code Editor
def power_up():
    print("Reaching elite level!")
    return power * 1000

# Your legendary code starts here
power_up()` ,
    java: `// Welcome to Ezlite Code Editor
public class Main {
    public static void main(String[] args) {
        System.out.println("Reaching elite level!");
        int power = 1;
        System.out.println(power * 1000);
    }
}
// Your legendary code starts here`,
    cpp: `// Welcome to Elite Code Editor
#include <iostream>
using namespace std;
int main() {
    std::cout << "Reaching elite level!" << std::endl;
    int power = 1;
    std::cout << power * 1000 << std::endl;
    return 0;
}
// Your legendary code starts here`,
    c: `// Welcome to Elite Code Editor
#include <stdio.h>
int main() {
    printf("Reaching elite level!\n");
    int power = 1;
    printf("%d\n", power * 1000);
    return 0;
}
// Your legendary code starts here`,
    go: `// Welcome to Elite Code Editor
package main
import "fmt"
func main() {
    fmt.Println("Reaching elite level!")
    power := 1
    fmt.Println(power * 1000)
}
// Your legendary code starts here`,
  };

  const languageExtensionMap: Record<string, string> = {
    javascript: "js",
    python: "py",
    java: "java",
    cpp: "cpp",
    c: "c",
    go: "go",
  };

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [language, setLanguage] = useState<string>("javascript");
  const [code, setCode] = useState<string>(defaultCode["javascript"]);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedCodes, setSavedCodes] = useState<SavedCode[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [input, setInput] = useState<string>("")
  const [output, setOutput] = useState<string>("Elite Code Terminal v1.0\nReady to execute your legendary code...\n> ")
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<{ success: boolean; user: { name: string; email: string } }>("/api/user");
        if (response.data.success) {
          setUser(response.data.user);
          fetchSavedCodes();
        } else {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const fetchSavedCodes = async () => {
    try {
      const response = await axios.get<{ success: boolean; snippets: SavedCode[] }>("/api/saved-codes");
      if (response.data.success) {
        setSavedCodes(response.data.snippets);
      }
    } catch (error) {
      console.error("Failed to fetch saved codes:", error);
    }
  };

  const handleSaveCode = async (filename: string) => {
    setSaving(true);
    try {
      const response = await axios.post<{ success: boolean; message: string; snippet: SavedCode }>("/api/save-code", {
        code,
        language,
        filename: filename + "." + languageExtensionMap[language]
      });
      if (response.data.success) {
        await fetchSavedCodes();
        setOutput(prev => prev + "\nCode saved successfully as " + filename + "." + languageExtensionMap[language] + "\n> ");
        toast.success("Code saved successfully!");
      }
    } catch (error: unknown) {
      setOutput(prev => prev + "\nError saving code: " + (error instanceof Error ? error.message : String(error)) + "\n> ");
      toast.error("Error saving code: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setSaving(false);
    }
  };

  const handleLoadCode = async (snippet: SavedCode) => {
    setCode(snippet.code);
    setLanguage(snippet.language);
    setOutput(prev => prev + "\nLoaded: " + snippet.filename + "\n> ");
  };

  const handleSignOut = async () => {
    try {
      await axios.post("/api/logout");
      toast.success("Signed out successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout failed:", error);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(defaultCode[lang as keyof typeof defaultCode]);
  };

  const runCode = async () => {
    try {
      setOutput((prev) => prev + "\nRunning code...\n");
      const response = await axios.post<{ success: boolean; output: string; error: string }>("/api/run", {
        code,
        language,
        input,
      });
      if (response.data.success) {
        setOutput(prev => prev + (response.data.output || "No output") + "\n> ");
      } else {
        setOutput(prev => prev + "Error: " + (response.data.error || "Execution failed") + "\n> ");
        toast.error(response.data.error || "Execution failed");
      }
    } catch (err: unknown) {
      setOutput(prev => prev + "Error: " + (err instanceof Error ? err.message : String(err)) + "\n> ");
      toast.error(err instanceof Error ? err.message : String(err));
    }
  };

  // Handler for Tab in code editor
  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = code.substring(0, start) + "    " + code.substring(end); // 4 spaces
      setCode(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Code className="w-7 h-7 text-black" />
          </div>
          <p className="text-gray-400">Loading Elite Code Editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-orange-500/30 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${!sidebarOpen ? 'lg:w-0 lg:overflow-hidden' : 'lg:w-64'}`}
      >
        <div className={`flex items-center justify-between p-4 border-b border-orange-500/30 ${!sidebarOpen ? 'lg:hidden' : ''}`}>
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-black" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              ELITE CODE
            </span>
          </Link>
        </div>
        <div className={`p-4 space-y-4 ${!sidebarOpen ? 'lg:hidden' : ''}`}>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Language</label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="bg-black border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="c">C</SelectItem>
                <SelectItem value="go">Go</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Saved Files</h3>
            <div className="space-y-1">
              {savedCodes.length === 0 ? (
                <p className="text-gray-500 text-sm px-2 py-1">No saved files yet</p>
              ) : (
                savedCodes.map((snippet) => (
                  <Button
                    key={snippet._id}
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-orange-500/10"
                    onClick={() => handleLoadCode(snippet)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    <div className="flex-1 text-left truncate">
                      <div className="truncate">{snippet.filename}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {new Date(snippet.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Button>
                ))
              )}
            </div>
          </div>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-orange-500/30 ${!sidebarOpen ? 'lg:hidden' : ''}`}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {loading ? "Loading..." : user?.name || "Guest"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email || "Not signed in"}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-400 hover:text-white"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-gray-900 border-b border-orange-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                title={sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
              >
                {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
              </Button>
              <h1 className="text-xl font-bold text-white">Elite Code Editor</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25"
                onClick={runCode}
              >
                <Play className="w-4 h-4 mr-2" />
                Run
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black hover:from-orange-600 hover:to-yellow-600 shadow-lg shadow-orange-500/25"
                onClick={() => setShowSaveModal(true)}
                disabled={saving}
              >
                <Code className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Code"}
              </Button>
            </div>
          </div>
        </header>
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-400">elite_code.{languageExtensionMap[language]}</span>
              </div>
            </div>
            <div className="flex-1 relative">
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleCodeKeyDown}
                className="w-full h-full ml-2  bg-gray-900 border-0 text-white font-mono text-sm resize-none focus:ring-0 focus:outline-none p-4"
                style={{ minHeight: "400px" }}
              />
              <div className="absolute top-4 left-1 text-xs text-gray-500 pointer-events-none">
                {code.split("\n").map((_, index) => (
                  <div key={index} className="h-5 leading-5">
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-96 flex flex-col border-l border-orange-500/30">
            <Card className="bg-gray-900 border-orange-500/30 rounded-none border-l-0 border-r-0 border-t-0">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-orange-500 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Testcase Input
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-orange-500"
                  onClick={() => setInput("")}
                  title="Clear Input"
                >
                  Clear
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter test input here..."
                  className="bg-black border-gray-600 text-white placeholder-gray-500 font-mono text-sm min-h-[100px] resize-none"
                />
              </CardContent>
            </Card>
            <Card className="flex-1 bg-gray-900 border-orange-500/30 rounded-none border-l-0 border-r-0 border-b-0">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-green-500 flex items-center">
                  <Terminal className="w-4 h-4 mr-2" />
                  Output Display
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-green-500"
                  onClick={() => setOutput("Elite Code Terminal v1.0\nReady to execute your legendary code...\n> ")}
                  title="Clear Output"
                >
                  Clear
                </Button>
              </CardHeader>
              <CardContent className="flex-1">
                <div ref={outputRef} className="bg-black rounded-lg p-4 h-full min-h-[200px] font-mono text-sm">
                  <div className="text-green-400 whitespace-pre-wrap">
                    {output}
                    <span className="animate-pulse">█</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="bg-gray-800 border-t border-orange-500/30 px-4 py-2 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <span>{language.charAt(0).toUpperCase() + language.slice(1)}</span>
            <span>UTF-8</span>
            <span>Ln 1, Col 1</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-3 h-3 text-orange-500" />
            <span>Power Level: Elite!</span>
          </div>
        </div>
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      {!sidebarOpen && (
        <div className="fixed left-4 top-4 z-50 lg:block hidden">
          <Button
            variant="ghost"
            size="sm"
            className="bg-gray-900/80 backdrop-blur-sm border border-orange-500/30 text-orange-500 hover:text-white hover:bg-orange-500/20"
            onClick={() => setSidebarOpen(true)}
            title="Show Sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </Button>
        </div>
      )}
      <Modal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveCode}
        title="Save Code"
        placeholder="Enter filename (without extension)"
        defaultValue=""
      />
    </div>
  )
}
