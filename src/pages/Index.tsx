
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Zap, Link2, ExternalLink, Lock, Play, Server, LineChart, Code, FileText, Layers } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            DataZen Flow
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            AI-Powered SaaS ETL Workflow & Data Transformation Platform
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-950">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gray-800 border-gray-700 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Database className="h-5 w-5" />
                <span>Database Connections</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Connect to multiple data sources
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>Connect to PostgreSQL, MySQL, Supabase, Neon.tech, Oracle, and more with secure credential management.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Zap className="h-5 w-5" />
                <span>AI-Powered Transformations</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Natural language to SQL
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>Transform your data using natural language queries that our AI converts into SQL, with no coding required.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Layers className="h-5 w-5" />
                <span>Visual Workflow Builder</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Drag-and-drop ETL pipelines
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>Create complex data transformation workflows visually with our intuitive drag-and-drop interface.</p>
            </CardContent>
          </Card>
        </div>

        {/* Platform Architecture */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Platform Architecture</h2>
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/56c4ba91-ac3b-49ee-868b-decde287d48b.png" 
              alt="DataZen Architecture" 
              className="rounded-lg shadow-2xl max-w-full md:max-w-2xl" 
            />
          </div>
        </div>

        {/* Database Relationship Visualization */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Database Visualization</h2>
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/97c95292-80ee-4091-b182-dece93814f60.png" 
              alt="Database Relationship Visualization" 
              className="rounded-lg shadow-2xl max-w-full md:max-w-4xl" 
            />
          </div>
        </div>

        {/* Core Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gray-800 border-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Server className="h-5 w-5" />
                  <span>Multi-Tenant SaaS</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <ul className="list-disc list-inside">
                  <li>Secure user authentication</li>
                  <li>Role-based access control</li>
                  <li>Subscription-based model</li>
                  <li>Isolated user workspaces</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <LineChart className="h-5 w-5" />
                  <span>Data Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <ul className="list-disc list-inside">
                  <li>Schema visualization</li>
                  <li>Data profiling and statistics</li>
                  <li>Relationship mapping</li>
                  <li>Data quality assessment</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Code className="h-5 w-5" />
                  <span>SQL Transformation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <ul className="list-disc list-inside">
                  <li>Query builder with validation</li>
                  <li>SQL execution and preview</li>
                  <li>Query optimization</li>
                  <li>Version control and history</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-400">
                  <Play className="h-5 w-5" />
                  <span>Workflow Engine</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <ul className="list-disc list-inside">
                  <li>Pipeline scheduling</li>
                  <li>Error handling and recovery</li>
                  <li>Execution monitoring</li>
                  <li>Audit logging</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Data Pipeline?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Get started today with our powerful ETL platform and unlock insights from your data.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Sign Up Now
            </Button>
            <Button size="lg" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-950">
              Schedule a Demo
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
              <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">
                Features
              </Link>
              <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">
                Pricing
              </Link>
              <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">
                Documentation
              </Link>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-400">
                <Lock className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-400">
                <ExternalLink className="h-5 w-5" />
              </Button>
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
