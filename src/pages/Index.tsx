
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GithubIcon, Database, Zap, Link2 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Vanna Connector</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A powerful data connection and visualization tool for seamless data analysis
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-2 border-blue-100 shadow-md hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500" />
                <span>Data Integration</span>
              </CardTitle>
              <CardDescription>
                Connect to multiple data sources effortlessly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Vanna Connector enables you to connect, transform, and visualize data from various sources with intuitive interfaces and powerful processing capabilities.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Connect Data Source
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-2 border-purple-100 shadow-md hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                <span>Analytics Tools</span>
              </CardTitle>
              <CardDescription>
                Powerful analysis with minimal configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-600">
                Our platform provides advanced analytics tools that help you gain insights from your data quickly:
              </p>
              <ul className="list-disc list-inside text-gray-600 pl-2">
                <li>Interactive dashboards</li>
                <li>AI-powered insights</li>
                <li>Real-time visualization</li>
                <li>Custom report generation</li>
                <li>Collaborative workspaces</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                Explore Features
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="https://github.com/Abisheakraj/vanna-connector.git" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="flex items-center gap-2">
                <GithubIcon className="h-4 w-4" />
                GitHub Repository
              </Button>
            </a>
            <Button variant="outline" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
