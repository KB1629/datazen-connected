
import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from 'react-router-dom';
import { Database, Plus, Search, ExternalLink, DatabaseZap, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const sampleProjects = [
  {
    id: 'ecommerce-analytics',
    name: 'E-commerce Analytics',
    description: 'ETL pipeline for e-commerce data analysis',
    tables: 8,
    lastModified: '2 days ago',
    source: 'PostgreSQL',
    destination: 'BigQuery'
  },
  {
    id: 'customer-segmentation',
    name: 'Customer Segmentation',
    description: 'ML-ready data pipeline for customer analysis',
    tables: 5,
    lastModified: '1 week ago',
    source: 'MySQL',
    destination: 'Snowflake'
  },
  {
    id: 'marketing-dashboard',
    name: 'Marketing Performance',
    description: 'Marketing data consolidation and reporting',
    tables: 12,
    lastModified: '3 days ago',
    source: 'Google Analytics',
    destination: 'PostgreSQL'
  }
];

const Projects = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProjects = sampleProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Projects</h1>
            <p className="text-gray-400 mt-1">Create and manage your ETL workflows</p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="border-gray-700 text-gray-300 hover:bg-gray-700"
              onClick={() => window.open('https://github.com/vanna-ai/vanna', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Examples
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate('/project/setup')}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        <div className="mb-6 flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="bg-gray-800">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">All</TabsTrigger>
              <TabsTrigger value="recent" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Recent</TabsTrigger>
              <TabsTrigger value="samples" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Samples</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Project Card */}
          <Card className="bg-gray-800 border-gray-700 hover:border-primary/30 hover:bg-gray-800/90 transition-all group">
            <CardHeader className="pb-3">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-white text-xl">Create New Project</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-gray-400">
                Start a new ETL workflow by connecting to a database or selecting a sample dataset.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors"
                onClick={() => navigate('/project/setup')}
              >
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
          
          {/* Project Cards */}
          {filteredProjects.map(project => (
            <Card key={project.id} className="bg-gray-800 border-gray-700 hover:border-primary/30 hover:bg-gray-800/90 transition-all">
              <CardHeader className="pb-3">
                <div className="h-12 w-12 rounded-full bg-blue-900/20 flex items-center justify-center mb-2">
                  <Database className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle className="text-white text-xl">{project.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-gray-400 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-y-2 text-sm">
                  <div className="w-1/2 flex items-center text-gray-400">
                    <Database className="h-4 w-4 mr-1" /> 
                    <span>{project.tables} tables</span>
                  </div>
                  <div className="w-1/2 text-gray-400">
                    <span>Last modified: {project.lastModified}</span>
                  </div>
                  
                  <div className="w-full flex items-center justify-between mt-2 pt-2 border-t border-gray-700">
                    <div className="flex items-center text-xs">
                      <div className="px-2 py-1 rounded bg-blue-900/30 text-blue-400 mr-2">
                        {project.source}
                      </div>
                      <ArrowRight className="h-3 w-3 text-gray-500 mr-2" />
                      <div className="px-2 py-1 rounded bg-green-900/30 text-green-400">
                        {project.destination}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-700" 
                  variant="outline"
                  onClick={() => navigate(`/workflows/create?project=${project.id}`)}
                >
                  Open Project
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Projects;
