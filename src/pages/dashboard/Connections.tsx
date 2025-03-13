
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Plus, Server, Search, Trash2, Check, X, AlertCircle, RefreshCw } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Mock data for existing connections
const existingConnections = [
  { id: 1, name: "Production Database", type: "PostgreSQL", host: "prod-db.example.com", port: "5432", username: "admin", status: "connected", tables: 32 },
  { id: 2, name: "Analytics Data", type: "MySQL", host: "analytics.example.com", port: "3306", username: "analyst", status: "connected", tables: 18 },
  { id: 3, name: "User Database", type: "Supabase", host: "db.supabase.co", port: "5432", username: "service_role", status: "warning", tables: 12 },
  { id: 4, name: "Product Catalog", type: "Neon.tech", host: "db.neon.tech", port: "5432", username: "postgres", status: "error", tables: 0 },
];

const Connections = () => {
  const [connections, setConnections] = useState(existingConnections);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingConnection, setIsAddingConnection] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  
  // New connection state
  const [newConnection, setNewConnection] = useState({
    name: "",
    type: "",
    host: "",
    port: "",
    username: "",
    password: "",
    database: ""
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewConnection((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleTypeChange = (value: string) => {
    setNewConnection((prev) => ({
      ...prev,
      type: value
    }));
  };
  
  const testConnection = () => {
    setIsTestingConnection(true);
    
    // Simulate testing the connection
    setTimeout(() => {
      setIsTestingConnection(false);
      
      // For demo purposes, succeed if all fields are filled
      const allFieldsFilled = Object.values(newConnection).every(val => val !== "");
      
      if (allFieldsFilled) {
        toast.success("Connection test successful!");
      } else {
        toast.error("Connection test failed. Please check your credentials.");
      }
    }, 2000);
  };
  
  const handleAddConnection = () => {
    // Validate fields
    if (!newConnection.name || !newConnection.type || !newConnection.host) {
      toast.error("Name, type, and host are required fields");
      return;
    }
    
    // Add the new connection
    const newConnectionWithId = {
      id: connections.length + 1,
      ...newConnection,
      status: "connected",
      tables: Math.floor(Math.random() * 20) + 5
    };
    
    setConnections([...connections, newConnectionWithId as any]);
    
    // Reset form and close dialog
    setNewConnection({
      name: "",
      type: "",
      host: "",
      port: "",
      username: "",
      password: "",
      database: ""
    });
    
    setIsAddingConnection(false);
    toast.success(`${newConnection.name} added successfully!`);
  };
  
  const deleteConnection = (id: number) => {
    setConnections(connections.filter(conn => conn.id !== id));
    toast.success("Connection deleted successfully");
  };
  
  const refreshConnection = (id: number) => {
    // Simulate refresh
    toast.success("Refreshing connection metadata...");
    setTimeout(() => {
      toast.success("Connection refreshed successfully");
    }, 1500);
  };
  
  // Filter connections based on search
  const filteredConnections = connections.filter(conn => 
    conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Database Connections</h1>
            <p className="text-gray-400 mt-1">Manage your database connections and explore schemas</p>
          </div>
          
          <Dialog open={isAddingConnection} onOpenChange={setIsAddingConnection}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Connection
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl">Add New Connection</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Enter your database connection details. All information is encrypted.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Connection Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Production Database"
                      value={newConnection.name}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="type" className="text-gray-300">Database Type</Label>
                    <Select onValueChange={handleTypeChange}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select database type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600 text-white">
                        <SelectItem value="PostgreSQL">PostgreSQL</SelectItem>
                        <SelectItem value="MySQL">MySQL</SelectItem>
                        <SelectItem value="Supabase">Supabase</SelectItem>
                        <SelectItem value="Neon.tech">Neon.tech</SelectItem>
                        <SelectItem value="Oracle">Oracle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="host" className="text-gray-300">Host / Endpoint</Label>
                    <Input
                      id="host"
                      name="host"
                      placeholder="db.example.com"
                      value={newConnection.host}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="port" className="text-gray-300">Port</Label>
                    <Input
                      id="port"
                      name="port"
                      placeholder="5432"
                      value={newConnection.port}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="database" className="text-gray-300">Database Name</Label>
                    <Input
                      id="database"
                      name="database"
                      placeholder="postgres"
                      value={newConnection.database}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-300">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="postgres"
                      value={newConnection.username}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={newConnection.password}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex space-x-2 justify-between sm:justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-gray-600 text-white hover:bg-gray-700"
                  onClick={testConnection}
                  disabled={isTestingConnection}
                >
                  {isTestingConnection ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Test Connection"
                  )}
                </Button>
                <div className="flex space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="border-gray-600 text-white hover:bg-gray-700"
                    onClick={() => setIsAddingConnection(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleAddConnection}
                  >
                    Add Connection
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Search & Filters */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search connections..." 
            className="pl-10 bg-gray-800 border-gray-700 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Connections List */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-gray-700">All</TabsTrigger>
            <TabsTrigger value="postgresql" className="data-[state=active]:bg-gray-700">PostgreSQL</TabsTrigger>
            <TabsTrigger value="mysql" className="data-[state=active]:bg-gray-700">MySQL</TabsTrigger>
            <TabsTrigger value="other" className="data-[state=active]:bg-gray-700">Other</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {filteredConnections.length === 0 ? (
              <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                <Database className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white">No connections found</h3>
                <p className="text-gray-400 mt-1 mb-4">Try adjusting your search or add a new connection</p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsAddingConnection(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Connection
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredConnections.map((connection) => (
                  <Card key={connection.id} className="bg-gray-800 border-gray-700 shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-white flex items-center">
                            {connection.name}
                            {connection.status === "warning" && (
                              <AlertCircle className="h-4 w-4 text-yellow-400 ml-2" />
                            )}
                            {connection.status === "error" && (
                              <X className="h-4 w-4 text-red-400 ml-2" />
                            )}
                            {connection.status === "connected" && (
                              <Check className="h-4 w-4 text-green-400 ml-2" />
                            )}
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            {connection.type}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                            onClick={() => refreshConnection(connection.id)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-gray-700"
                            onClick={() => deleteConnection(connection.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex justify-between">
                          <span>Host:</span>
                          <span className="text-gray-300">{connection.host}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Port:</span>
                          <span className="text-gray-300">{connection.port}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>User:</span>
                          <span className="text-gray-300">{connection.username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tables:</span>
                          <span className="text-gray-300">{connection.tables}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <Button
                          variant="outline"
                          className="w-full border-gray-700 text-gray-300 hover:bg-gray-700"
                        >
                          <Server className="h-4 w-4 mr-2" />
                          View Schema
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="postgresql" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredConnections
                .filter(conn => conn.type === "PostgreSQL" || conn.type === "Supabase" || conn.type === "Neon.tech")
                .map((connection) => (
                  <Card key={connection.id} className="bg-gray-800 border-gray-700 shadow-lg">
                    {/* Same card content as above, repeated for each tab */}
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-white flex items-center">
                            {connection.name}
                            {connection.status === "connected" && (
                              <Check className="h-4 w-4 text-green-400 ml-2" />
                            )}
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            {connection.type}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-gray-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex justify-between">
                          <span>Host:</span>
                          <span className="text-gray-300">{connection.host}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Port:</span>
                          <span className="text-gray-300">{connection.port}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>User:</span>
                          <span className="text-gray-300">{connection.username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tables:</span>
                          <span className="text-gray-300">{connection.tables}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <Button
                          variant="outline"
                          className="w-full border-gray-700 text-gray-300 hover:bg-gray-700"
                        >
                          <Server className="h-4 w-4 mr-2" />
                          View Schema
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="mysql" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredConnections
                .filter(conn => conn.type === "MySQL")
                .map((connection) => (
                  <Card key={connection.id} className="bg-gray-800 border-gray-700 shadow-lg">
                    {/* Same card content structure as above */}
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-white">{connection.name}</CardTitle>
                          <CardDescription className="text-gray-400">
                            {connection.type}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex justify-between">
                          <span>Host:</span>
                          <span className="text-gray-300">{connection.host}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Port:</span>
                          <span className="text-gray-300">{connection.port}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>User:</span>
                          <span className="text-gray-300">{connection.username}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <Button
                          variant="outline"
                          className="w-full border-gray-700 text-gray-300 hover:bg-gray-700"
                        >
                          <Server className="h-4 w-4 mr-2" />
                          View Schema
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="other" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredConnections
                .filter(conn => !["PostgreSQL", "MySQL", "Supabase", "Neon.tech"].includes(conn.type))
                .map((connection) => (
                  <Card key={connection.id} className="bg-gray-800 border-gray-700 shadow-lg">
                    {/* Same card content structure as above */}
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-white">{connection.name}</CardTitle>
                          <CardDescription className="text-gray-400">
                            {connection.type}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex justify-between">
                          <span>Host:</span>
                          <span className="text-gray-300">{connection.host}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Port:</span>
                          <span className="text-gray-300">{connection.port}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>User:</span>
                          <span className="text-gray-300">{connection.username}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <Button
                          variant="outline"
                          className="w-full border-gray-700 text-gray-300 hover:bg-gray-700"
                        >
                          <Server className="h-4 w-4 mr-2" />
                          View Schema
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Connections;
