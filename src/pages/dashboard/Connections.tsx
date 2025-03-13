
import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Plus, 
  Database, 
  Filter, 
  FileSpreadsheet, 
  X,
  Server,
  Zap 
} from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import DataSourceCard from '@/components/etl/DataSourceCard';
import ConnectionForm from '@/components/etl/ConnectionForm';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { externalDataSources } from '@/data/dataSources';

interface Connection {
  id: string;
  name: string;
  type: string;
  host: string;
  status: string;
  error?: string;
  updatedAt: string;
  icon: React.ReactNode;
}

const Connections = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState<string | null>(null);
  
  // Demo connections
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: '1',
      name: 'Production DB',
      type: 'PostgreSQL',
      host: 'db.example.com',
      status: 'Connected',
      updatedAt: '2 hours ago',
      icon: <Database className="h-8 w-8 text-blue-400" />
    },
    {
      id: '2',
      name: 'Analytics Warehouse',
      type: 'BigQuery',
      host: 'analytics-project.bigquery.com',
      status: 'Connected',
      updatedAt: '1 day ago',
      icon: <Database className="h-8 w-8 text-yellow-400" />
    },
    {
      id: '3',
      name: 'Data Lake',
      type: 'Snowflake',
      host: 'company.snowflakecomputing.com',
      status: 'Error',
      error: 'Connection timeout',
      updatedAt: '5 days ago',
      icon: <FileSpreadsheet className="h-8 w-8 text-blue-300" />
    }
  ]);
  
  // Filter data sources based on search term
  const filteredDataSources = externalDataSources.filter(source => 
    source.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter connections based on search term and active tab
  const filteredConnections = connections.filter(connection => {
    // Filter by search term
    const matchesSearch = 
      connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.host.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tab
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'active' && connection.status === 'Connected') ||
      (activeTab === 'inactive' && connection.status === 'Error');
    
    return matchesSearch && matchesTab;
  });
  
  const handleOpenConnectionForm = (dataSourceId: string) => {
    setSelectedDataSource(dataSourceId);
    setIsFormOpen(true);
  };
  
  const handleCloseConnectionForm = () => {
    setSelectedDataSource(null);
    setIsFormOpen(false);
  };
  
  const handleCreateConnection = (data: any) => {
    // Get the selected data source
    const dataSource = externalDataSources.find(source => source.id === selectedDataSource);
    
    if (!dataSource) {
      toast.error("Data source not found");
      return;
    }
    
    // Create a new connection
    const newConnection: Connection = {
      id: Date.now().toString(),
      name: data.name,
      type: dataSource.name,
      host: data.host,
      status: 'Connected',
      updatedAt: 'Just now',
      icon: dataSource.icon,
    };
    
    setConnections([...connections, newConnection]);
    toast.success(`Connection to ${dataSource.name} created successfully!`);
    setIsFormOpen(false);
  };
  
  const getSelectedDataSourceName = () => {
    const dataSource = externalDataSources.find(source => source.id === selectedDataSource);
    return dataSource ? dataSource.name : '';
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Database Connections</h1>
            <p className="text-gray-400">Connect to your databases and manage your data sources</p>
          </div>
          <div className="flex gap-2">
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
                
                <div className="flex items-center gap-2 w-full md:w-auto">
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
                
                {filteredConnections.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredConnections.map((connection) => (
                      <DataSourceCard
                        key={connection.id}
                        title={connection.name}
                        type={connection.type}
                        host={connection.host}
                        status={connection.status}
                        error={connection.error}
                        updatedAt={connection.updatedAt}
                        icon={connection.icon}
                        onClick={() => console.log(`Clicked on ${connection.name}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-900/50 rounded-md border border-gray-700">
                    <Database className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                    <h3 className="text-lg font-medium text-white mb-1">No connections found</h3>
                    <p className="text-gray-400 mb-4">
                      {searchTerm 
                        ? "No connections match your search criteria" 
                        : "Start by creating a new database connection"}
                    </p>
                    {searchTerm && (
                      <Button 
                        variant="outline" 
                        onClick={() => setSearchTerm('')}
                        className="mx-auto"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Clear Search
                      </Button>
                    )}
                  </div>
                )}
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
                        {/* Beta badge will be rendered only if source has a beta property */}
                        {source.hasOwnProperty('beta') && (source as any).beta && (
                          <Badge variant="outline" className="ml-2 text-xs border-blue-500 text-blue-400">
                            Beta
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-4">{source.description}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-gray-700 text-gray-300 hover:bg-gray-700"
                        onClick={() => handleOpenConnectionForm(source.id)}
                      >
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
      
      {/* Connection Form Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl bg-gray-900 border-gray-800 overflow-y-auto">
          <SheetHeader className="mb-5">
            <SheetTitle className="text-white">New Database Connection</SheetTitle>
            <SheetDescription className="text-gray-400">
              Configure your connection to {getSelectedDataSourceName()}
            </SheetDescription>
          </SheetHeader>
          
          {selectedDataSource && (
            <ConnectionForm 
              dbType={getSelectedDataSourceName()}
              onCancel={handleCloseConnectionForm}
              onSubmit={handleCreateConnection}
            />
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

export default Connections;
