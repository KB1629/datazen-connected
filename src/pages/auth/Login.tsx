
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Database className="h-12 w-12 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            DataZen Flow
          </h1>
          <p className="text-gray-300 mt-2">Sign in to your account</p>
        </div>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">Login</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <Link to="#" className="text-sm text-blue-400 hover:text-blue-300">
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
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
              
              <div className="text-center text-gray-400 text-sm mt-2">
                <p>Demo credentials: demo@example.com / password</p>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-2">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-700">
                Google
              </Button>
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-700">
                GitHub
              </Button>
            </div>
            
            <div className="text-center text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-400 hover:text-blue-300">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
