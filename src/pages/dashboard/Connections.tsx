
import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Database, Filter, FileSpreadsheet, TableProperties, Code, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { externalDataSources } from '@/data/dataSources';
import DataSourceCard from '@/components/etl/DataSourceCard';
import { Separator } from "@/components/ui/separator";

const Connections = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter data sources based on search term and active tab
  const filteredDataSources = externalDataSources.filter(source => 
    source.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Database Connections</h1>
            <p className="text-gray-400">Connect to your databases and manage your data sources</p>
          </div>
          <div className="flex gap-2">
            <Link to="/sql-explorer">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Code className="mr-2 h-4 w-4" />
                SQL Explorer
              </Button>
            </Link>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              New Connection
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Search connections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-gray-700 border-gray-600 text-white w-full"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-700">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Tabs defaultValue="all" className="w-auto" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-gray-700">
                      <TabsTrigger value="all" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                        All
                      </TabsTrigger>
                      <TabsTrigger value="active" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                        Active
                      </TabsTrigger>
                      <TabsTrigger value="inactive" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                        Inactive
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              
              {/* Your existing connections (mock data) */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Your Connections</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <DataSourceCard
                    title="Production DB"
                    type="PostgreSQL"
                    host="db.example.com"
                    status="Connected"
                    updatedAt="2 hours ago"
                    icon={<Database className="h-8 w-8 text-blue-400" />}
                  />
                  <DataSourceCard
                    title="Analytics Warehouse"
                    type="BigQuery"
                    host="analytics-project.bigquery.com"
                    status="Connected"
                    updatedAt="1 day ago"
                    icon={<Database className="h-8 w-8 text-yellow-400" />}
                  />
                  <DataSourceCard
                    title="Data Lake"
                    type="Snowflake"
                    host="company.snowflakecomputing.com"
                    status="Error"
                    error="Connection timeout"
                    updatedAt="5 days ago"
                    icon={<FileSpreadsheet className="h-8 w-8 text-blue-300" />}
                  />
                </div>
              </div>
              
              <Separator className="bg-gray-700 my-6" />
              
              {/* Add connection section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Add New Connection</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDataSources.map((source) => (
                    <div 
                      key={source.id}
                      className="db-connection-card cursor-pointer"
                    >
                      <div className="flex items-center mb-3">
                        {source.icon}
                        <span className="ml-2 font-medium text-white">{source.name}</span>
                        {source.beta && (
                          <Badge variant="outline" className="ml-2 text-xs border-blue-500 text-blue-400">
                            Beta
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-4">{source.description}</p>
                      <Button variant="outline" size="sm" className="w-full border-gray-700 text-gray-300 hover:bg-gray-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Connections;
