
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Zap, Link2, ExternalLink, Lock, Play, Server, LineChart, Code, ArrowRight, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      // Error is already displayed by toast in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    
    try {
      await login("demo@example.com", "password");
      navigate("/dashboard");
    } catch (error) {
      console.error("Demo login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section with Login */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="text-center lg:text-left animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            DataZen Flow
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            AI-Powered ETL Workflow & Data Transformation Platform
          </p>
          <div className="hidden lg:block">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-all hover:bg-gray-800/80 hover:scale-105">
                <Zap className="h-8 w-8 text-blue-400 mb-2" />
                <h3 className="text-lg font-medium mb-1">AI-Powered</h3>
                <p className="text-gray-400">Transform data using natural language</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-all hover:bg-gray-800/80 hover:scale-105">
                <Server className="h-8 w-8 text-purple-400 mb-2" />
                <h3 className="text-lg font-medium mb-1">Multi-Database</h3>
                <p className="text-gray-400">Connect to various data sources</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-green-500 transition-all hover:bg-gray-800/80 hover:scale-105">
                <LineChart className="h-8 w-8 text-green-400 mb-2" />
                <h3 className="text-lg font-medium mb-1">Visual Insights</h3>
                <p className="text-gray-400">Interactive data visualization</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-yellow-500 transition-all hover:bg-gray-800/80 hover:scale-105">
                <Code className="h-8 w-8 text-yellow-400 mb-2" />
                <h3 className="text-lg font-medium mb-1">No Code Needed</h3>
                <p className="text-gray-400">Build workflows visually</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md bg-gray-800/70 border-gray-700 animate-scale-in backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-2">
                <Database className="h-12 w-12 text-blue-400" />
              </div>
              <CardTitle className="text-2xl text-center text-white">Sign in to your account</CardTitle>
              <CardDescription className="text-center text-gray-400">
                Enter your credentials to access your workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white transition-all focus:border-blue-500"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-gray-300 flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-gray-400" />
                      Password
                    </label>
                    <Link to="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white transition-all focus:border-blue-500"
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                
                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-blue-400 hover:text-blue-300 hover:bg-transparent p-0 h-auto text-sm"
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                  >
                    Use demo account
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 mt-2">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-800 px-2 text-gray-400">Or</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 w-full">
                <Button 
                  variant="outline" 
                  className="border-gray-700 text-white hover:bg-gray-700 transition-all"
                  onClick={() => toast.info("Google login coming soon!")}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-700 text-white hover:bg-gray-700 transition-all"
                  onClick={() => toast.info("GitHub login coming soon!")}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                    />
                  </svg>
                  GitHub
                </Button>
              </div>
              
              <div className="text-center text-gray-400 text-sm mt-4">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Features Section - Condensed */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose DataZen Flow?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition-all hover:bg-gray-800/80 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Zap className="h-5 w-5" />
                <span>AI-Powered Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>Transform complex data operations into natural language commands with our AI assistant.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500 transition-all hover:bg-gray-800/80 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Server className="h-5 w-5" />
                <span>Universal Connectivity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>Connect to any database or data source with our flexible and secure integration platform.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500 transition-all hover:bg-gray-800/80 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <LineChart className="h-5 w-5" />
                <span>Visual Workflow Builder</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>Create and manage data pipelines with our intuitive drag-and-drop interface - no coding required.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Data?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Join thousands of data professionals who trust DataZen Flow for their data transformation needs.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <User className="mr-2 h-5 w-5" />
                Sign Up Now
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-950">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                DataZen Flow
              </h3>
            </div>
            <div className="flex gap-6">
              <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">
                Home
              </Link>
              <Link to="/features" className="text-gray-400 hover:text-blue-400 transition-colors">
                Features
              </Link>
              <Link to="/pricing" className="text-gray-400 hover:text-blue-400 transition-colors">
                Pricing
              </Link>
              <Link to="/docs" className="text-gray-400 hover:text-blue-400 transition-colors">
                Documentation
              </Link>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-500">
            &copy; {new Date().getFullYear()} DataZen Flow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
