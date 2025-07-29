import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Zap, Shield, Rocket, Star, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-orange-500/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/25">
              <Code className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              ELITE CODE
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button className="text-white hover:text-orange-500 hover:bg-orange-500/10">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black hover:from-orange-600 hover:to-yellow-600 shadow-lg shadow-orange-500/25">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />

        <div className="container mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-gray-900/50 backdrop-blur-sm border border-orange-500/30 rounded-full px-6 py-2 mb-8">
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-orange-300 text-sm font-medium">LEGENDARY POWER</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent animate-pulse leading-tight">
              ELITE LEVEL
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">CODE EDITOR</h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Unleash your coding power with the ultimate development environment. Code like a legend, debug like a
              warrior.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/editor">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black hover:from-orange-600 hover:to-yellow-600 shadow-2xl shadow-orange-500/50 text-lg px-8 py-4 rounded-xl transform hover:scale-105 transition-all duration-300"
              >
                <Zap className="w-5 h-5 mr-2" />
                Try Editor
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black text-lg px-8 py-4 rounded-xl transform hover:scale-105 transition-all duration-300 bg-transparent"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </Link>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl shadow-orange-500/20 border border-orange-500/30">
              <div className="bg-black rounded-lg p-4 font-mono text-sm">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="ml-4 text-gray-400">elite_code.js</span>
                </div>
                <div className="text-left">
                  <div className="text-purple-400">
                    {"function"} <span className="text-yellow-500">powerUp</span>() {"{"}
                  </div>
                  <div className="ml-4 text-orange-500">
                    {"console.log"}(<span className="text-green-400">&quot;Reaching elite level!&quot;</span>);
                  </div>
                  <div className="ml-4 text-blue-400">
                    {"return"} <span className="text-yellow-500">power</span> *{" "}
                    <span className="text-orange-500">1000</span>;
                  </div>
                  <div>{"}"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      <section id="features" className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Legendary Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience coding with the power of elite-level development
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800/50 border-orange-500/30 hover:border-orange-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Lightning Fast</h3>
                <p className="text-gray-300">
                  Execute code at the speed of light with our optimized runtime environment.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-orange-500/30 hover:border-orange-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Secure Sandbox</h3>
                <p className="text-gray-300">
                  Your code runs in a protected environment, safe from any external threats.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-orange-500/30 hover:border-orange-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Multi-Language</h3>
                <p className="text-gray-300">
                  Support for Python, JavaScript, Java, C++, and many more programming languages.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              What Elite Coders Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Chen",
                role: "Senior Developer",
                content: "This editor gives me the power to code beyond my limits! The performance is incredible.",
                rating: 5,
              },
              {
                name: "Sarah Kim",
                role: "Tech Lead",
                content: "Finally, a coding environment worthy of elite-level development. The UI is stunning!",
                rating: 5,
              },
              {
                name: "Marcus Johnson",
                role: "Full Stack Developer",
                content: "The perfect balance of power and simplicity. Great for both learning and production.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gray-800/50 border-orange-500/30">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">&quot;{testimonial.content}&quot;</p>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-orange-500 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500/10 to-yellow-500/10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Go Elite?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who have already unlocked their coding potential
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black hover:from-orange-600 hover:to-yellow-600 shadow-2xl shadow-orange-500/50 text-lg px-12 py-4 rounded-xl transform hover:scale-105 transition-all duration-300"
            >
              <Users className="w-5 h-5 mr-2" />
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      
      <footer className="py-12 px-4 bg-black border-t border-orange-500/20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                ELITE CODE
              </span>
            </div>
            <div className="flex space-x-6 text-gray-400">
              <Link href="#" className="hover:text-orange-500 transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-orange-500 transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-orange-500 transition-colors">
                Support
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Elite Code. All rights reserved. Power level: Maximum!</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

