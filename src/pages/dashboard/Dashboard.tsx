
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Workflow, ArrowRight, Activity, Server, LineChart, Clock, AlertCircle, FolderKanban, Plus } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

// Mock data
const recentWorkflows = [
  { id: 1, name: "Sales Data ETL", status: "success", lastRun: "2 hours ago", tables: 4, source: "PostgreSQL", destination: "MySQL" },
  { id: 2, name: "User Analytics", status: "running", lastRun: "Running now", tables: 7, source: "Supabase", destination: "Neon.tech" },
  { id: 3, name: "Inventory Transform", status: "failed", lastRun: "1 day ago", tables: 3, source: "MySQL", destination: "PostgreSQL" },
];

const recentConnections = [
  { id: 1, name: "Production DB", type: "PostgreSQL", status: "connected", tables: 32 },
  { id: 2, name: "Analytics DB", type: "MySQL", status: "connected", tables: 18 },
  { id: 3, name: "User Data", type: "Supabase", status: "warning", tables: 12 },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">{greeting}, {user?.name}</h1>
          <p className="text-gray-400 mt-1">Here's what's happening with your ETL workflows</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700 shadow-lg hover:border-primary/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-blue-900/50 text-blue-400">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Database Connections</p>
                  <h3 className="text-2xl font-bold text-white">3</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700 shadow-lg hover:border-primary/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-purple-900/50 text-purple-400">
                  <Workflow className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Active Workflows</p>
                  <h3 className="text-2xl font-bold text-white">7</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700 shadow-lg hover:border-primary/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-green-900/50 text-green-400">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Transforms Completed</p>
                  <h3 className="text-2xl font-bold text-white">124</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700 shadow-lg hover:border-primary/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-yellow-900/50 text-yellow-400">
                  <LineChart className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Data Processed</p>
                  <h3 className="text-2xl font-bold text-white">2.4 GB</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Your Projects</h2>
            <Link to="/projects">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-800 border-gray-700 shadow-lg hover:border-primary/30 hover:bg-gray-800/90 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-full bg-blue-900/30 flex items-center justify-center">
                    <FolderKanban className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
                <CardTitle className="text-white text-lg">E-commerce Analytics</CardTitle>
                <CardDescription className="text-gray-400">
                  ETL pipeline for e-commerce data analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center text-gray-400 text-sm space-x-4">
                  <div className="flex items-center">
                    <Database className="h-4 w-4 mr-1" />
                    <span>8 tables</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>2 days ago</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/workflows/create?project=ecommerce-analytics" className="w-full">
                  <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-700">
                    Open Project
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 shadow-lg hover:border-primary/30 hover:bg-gray-800/90 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-full bg-purple-900/30 flex items-center justify-center">
                    <FolderKanban className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
                <CardTitle className="text-white text-lg">Customer Segmentation</CardTitle>
                <CardDescription className="text-gray-400">
                  ML-ready data pipeline for customer analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center text-gray-400 text-sm space-x-4">
                  <div className="flex items-center">
                    <Database className="h-4 w-4 mr-1" />
                    <span>5 tables</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>1 week ago</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/workflows/create?project=customer-segmentation" className="w-full">
                  <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-700">
                    Open Project
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 shadow-lg hover:border-primary/30 hover:bg-gray-800/90 transition-all group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-full bg-green-900/30 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-green-400" />
                  </div>
                </div>
                <CardTitle className="text-white text-lg">Create New Project</CardTitle>
                <CardDescription className="text-gray-400">
                  Start building a new ETL workflow
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-gray-400 text-sm">
                  Connect to databases, define transformations, and visualize your data.
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/project/setup" className="w-full">
                  <Button className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors">
                    Get Started
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {/* Recent Workflows */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Recent Workflows</h2>
            <Link to="/workflows">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recentWorkflows.map((workflow) => (
              <Card key={workflow.id} className="bg-gray-800 border-gray-700 shadow-lg hover:border-primary/30 transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white text-lg">{workflow.name}</CardTitle>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      workflow.status === 'success' ? 'bg-green-900/50 text-green-400' :
                      workflow.status === 'running' ? 'bg-blue-900/50 text-blue-400' :
                      'bg-red-900/50 text-red-400'
                    }`}>
                      {workflow.status === 'success' ? 'Success' :
                       workflow.status === 'running' ? 'Running' :
                       'Failed'}
                    </div>
                  </div>
                  <CardDescription className="text-gray-400">
                    {workflow.source} → {workflow.destination}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-gray-400 text-sm space-x-4">
                    <div className="flex items-center">
                      <Server className="h-4 w-4 mr-1" />
                      <span>{workflow.tables} tables</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{workflow.lastRun}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/workflows/${workflow.id}`} className="w-full">
                    <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-700">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Database Connections */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Database Connections</h2>
            <Link to="/connections">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                Manage <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentConnections.map((connection) => (
              <Card key={connection.id} className="bg-gray-800 border-gray-700 shadow-lg hover:border-primary/30 transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{connection.name}</CardTitle>
                    {connection.status === "warning" && (
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                    )}
                  </div>
                  <CardDescription className="text-gray-400">
                    {connection.type}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Database className="h-4 w-4 mr-1" />
                    <span>{connection.tables} tables available</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/connections/${connection.id}`} className="w-full">
                    <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-700">
                      View Schema
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
