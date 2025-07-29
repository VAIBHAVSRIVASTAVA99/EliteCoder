"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Code, Zap, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const data: { success?: boolean; message?: string; error?: string } = await res.json()
      if (res.ok && data.success) {
        toast.success("Login successful!")
        setTimeout(() => {
          router.push("/editor")
        }, 1000)
      } else {
        toast.error(data.message || data.error || "Login failed")
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5" />
      <div className="absolute top-20 left-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
              <Code className="w-7 h-7 text-black" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              ELITE CODE
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back, Elite</h1>
          <p className="text-gray-400">Power up your coding session</p>
        </div>

        {/* Login Card */}
        <Card className="bg-gray-900/80 backdrop-blur-md border-2 border-orange-500/30 shadow-2xl shadow-orange-500/20 hover:border-orange-500/50 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />
          <CardHeader className="space-y-1 pb-4 relative z-10">
            <CardTitle className="text-2xl text-center text-white">Sign In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="elite@coder.com"
                  className="bg-black/50 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20 h-12 w-full rounded-lg"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-black/50 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20 h-12 w-full rounded-lg pr-12"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-orange-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black hover:from-orange-600 hover:to-yellow-600 shadow-lg shadow-orange-500/25 h-12 rounded-lg font-semibold text-lg transform hover:scale-[1.02] transition-all duration-300" disabled={loading}>
                <Zap className="w-5 h-5 mr-2" />
                {loading ? "Signing In..." : "Power Up & Sign In"}
              </Button>
              <div className="text-center">
                <span className="text-gray-400">New to Elite Code? </span>
                <Link href="/signup" className="text-orange-500 hover:text-orange-400 font-semibold transition-colors">
                  Create Account
                </Link>
              </div>
            </form>
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">Join elite developers coding at legendary levels</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
