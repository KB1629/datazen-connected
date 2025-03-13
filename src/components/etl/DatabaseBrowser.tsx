
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Search, Database, MessageSquare, Code, Table as TableIcon, LineChart, Loader2, LayoutList, LayoutGrid } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface DatabaseTable {
  name: string;
  rowCount: number;
}

interface DatabaseBrowserProps {
  tables: DatabaseTable[];
  onSelectTable: (tableName: string) => void;
}

const DatabaseBrowser: React.FC<DatabaseBrowserProps> = ({ tables, onSelectTable }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('natural');
  const [queryInput, setQueryInput] = useState('');
  const [results, setResults] = useState<any[] | null>(null);
  const [isGeneratingSQL, setIsGeneratingSQL] = useState(false);
  const [generatedSQL, setGeneratedSQL] = useState<string | null>(null);
  const [isRunningQuery, setIsRunningQuery] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedTableName, setSelectedTableName] = useState<string | null>(null);

  const filteredTables = tables.filter(table => 
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRunQuery = () => {
    if (!queryInput.trim()) {
      toast.error("Please enter a SQL query");
      return;
    }
    
    setIsRunningQuery(true);
    
    // Mock data for demonstration
    setTimeout(() => {
      setResults([
        { customer_id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-1234', address: '123 Main St', created_at: '2023-01-15 09:30:00' },
        { customer_id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-5678', address: '456 Oak Ave', created_at: '2023-01-16 14:20:00' },
        { customer_id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-9012', address: '789 Pine Rd', created_at: '2023-01-17 11:45:00' },
        { customer_id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '555-3456', address: '101 Elm St', created_at: '2023-01-18 16:10:00' },
        { customer_id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', phone: '555-7890', address: '202 Maple Dr', created_at: '2023-01-19 10:05:00' }
      ]);
      setIsRunningQuery(false);
    }, 1500);
  };

  const handleNaturalLanguageQuery = () => {
    if (!queryInput.trim()) {
      toast.error("Please enter a question about your data");
      return;
    }
    
    setIsGeneratingSQL(true);
    
    // Simulate the AI processing
    setTimeout(() => {
      const mockSQL = `SELECT * FROM customers 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY created_at DESC
LIMIT 10;`;
      
      setGeneratedSQL(mockSQL);
      setIsGeneratingSQL(false);
      
      // After generating SQL, simulate running it
      setTimeout(() => {
        setResults([
          { customer_id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-1234', address: '123 Main St', created_at: '2023-01-15 09:30:00' },
          { customer_id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-5678', address: '456 Oak Ave', created_at: '2023-01-16 14:20:00' }
        ]);
      }, 1000);
    }, 2000);
  };

  const runGeneratedSQL = () => {
    setIsRunningQuery(true);
    
    // Simulate running the generated SQL
    setTimeout(() => {
      setResults([
        { customer_id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-1234', address: '123 Main St', created_at: '2023-01-15 09:30:00' },
        { customer_id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-5678', address: '456 Oak Ave', created_at: '2023-01-16 14:20:00' },
        { customer_id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-9012', address: '789 Pine Rd', created_at: '2023-01-17 11:45:00' }
      ]);
      setIsRunningQuery(false);
    }, 1500);
  };

  const editGeneratedSQL = () => {
    if (generatedSQL) {
      setQueryInput(generatedSQL);
      setSelectedTab('sql');
      setGeneratedSQL(null);
    }
  };

  const handleTableSelect = (tableName: string) => {
    setSelectedTableName(tableName);
    onSelectTable(tableName);
    
    // Mock data for the selected table
    setTimeout(() => {
      if (tableName === 'customers') {
        setResults([
          { customer_id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-1234', address: '123 Main St', created_at: '2023-01-15 09:30:00' },
          { customer_id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-5678', address: '456 Oak Ave', created_at: '2023-01-16 14:20:00' },
          { customer_id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-9012', address: '789 Pine Rd', created_at: '2023-01-17 11:45:00' },
          { customer_id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '555-3456', address: '101 Elm St', created_at: '2023-01-18 16:10:00' },
          { customer_id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', phone: '555-7890', address: '202 Maple Dr', created_at: '2023-01-19 10:05:00' }
        ]);
      } else if (tableName === 'orders') {
        setResults([
          { order_id: 1, customer_id: 1, total: 99.99, status: 'completed', created_at: '2023-01-15 10:30:00' },
          { order_id: 2, customer_id: 2, total: 149.99, status: 'processing', created_at: '2023-01-16 15:20:00' },
          { order_id: 3, customer_id: 3, total: 29.99, status: 'completed', created_at: '2023-01-17 12:45:00' },
          { order_id: 4, customer_id: 1, total: 49.99, status: 'shipped', created_at: '2023-01-18 17:10:00' },
          { order_id: 5, customer_id: 4, total: 199.99, status: 'completed', created_at: '2023-01-19 11:05:00' }
        ]);
      } else {
        setResults([
          { id: 1, name: 'Item 1', description: 'Description for item 1', created_at: '2023-01-15 09:30:00' },
          { id: 2, name: 'Item 2', description: 'Description for item 2', created_at: '2023-01-16 14:20:00' },
          { id: 3, name: 'Item 3', description: 'Description for item 3', created_at: '2023-01-17 11:45:00' }
        ]);
      }
    }, 500);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Left panel - Tables browser */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <Card className="bg-gray-800 border-gray-700 h-full">
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search tables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-300 flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  Tables
                </h3>
                <div className="flex">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-6 w-6 ${viewMode === 'list' ? 'text-primary' : 'text-gray-400'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <LayoutList className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-6 w-6 ${viewMode === 'grid' ? 'text-primary' : 'text-gray-400'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto">
                {filteredTables.map((table) => (
                  <div
                    key={table.name}
                    className={`flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-gray-700 cursor-pointer ${selectedTableName === table.name ? 'bg-gray-700' : ''}`}
                    onClick={() => handleTableSelect(table.name)}
                  >
                    <div className="flex items-center">
                      <TableIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-200">{table.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{table.rowCount} rows</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
        
        {/* Right panel - Query interface */}
        <div className="flex-1">
          <Card className="bg-gray-800 border-gray-700 h-full">
            <div className="p-4 flex flex-col h-full">
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="bg-gray-700 mb-4">
                  <TabsTrigger value="natural" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Natural Language
                  </TabsTrigger>
                  <TabsTrigger value="sql" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                    <Code className="h-4 w-4 mr-2" />
                    SQL Query
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="natural" className="mt-0">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Ask a question about your data in plain English... (e.g., 'Show me customers who signed up in the last 30 days')"
                      className="min-h-[60px] bg-gray-700 border-gray-600 text-white flex-1"
                      value={queryInput}
                      onChange={(e) => setQueryInput(e.target.value)}
                    />
                    <Button 
                      className="bg-primary hover:bg-primary/90" 
                      onClick={handleNaturalLanguageQuery}
                      disabled={isGeneratingSQL}
                    >
                      {isGeneratingSQL ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </div>
                  
                  {generatedSQL && (
                    <div className="mt-4 p-4 rounded-md border border-gray-700 bg-gray-900/50">
                      <h3 className="text-sm font-medium text-gray-300 mb-2">Generated SQL Query:</h3>
                      <pre className="bg-gray-900 p-3 rounded text-green-400 overflow-x-auto text-sm">
                        {generatedSQL}
                      </pre>
                      <div className="flex gap-2 mt-3 justify-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-gray-700 hover:bg-gray-700 text-gray-200"
                          onClick={editGeneratedSQL}
                        >
                          Edit Query
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={runGeneratedSQL}
                          disabled={isRunningQuery}
                        >
                          {isRunningQuery ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Running...
                            </>
                          ) : (
                            "Run SQL"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="sql" className="mt-0">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Write your SQL query here... (e.g., 'SELECT * FROM customers WHERE...')"
                      className="min-h-[60px] bg-gray-700 border-gray-600 text-white flex-1 font-mono"
                      value={queryInput}
                      onChange={(e) => setQueryInput(e.target.value)}
                    />
                    <Button 
                      className="bg-primary hover:bg-primary/90" 
                      onClick={handleRunQuery}
                      disabled={isRunningQuery}
                    >
                      {isRunningQuery ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Running...
                        </>
                      ) : (
                        "Run"
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              {results && (
                <div className="mt-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex gap-4">
                      <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-700 text-gray-200">
                        <TableIcon className="h-4 w-4 mr-2" />
                        Table
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-700 text-gray-200">
                        <LineChart className="h-4 w-4 mr-2" />
                        Chart
                      </Button>
                    </div>
                    <span className="text-sm text-gray-400">{results.length} results</span>
                  </div>
                  
                  <div className="flex-1 overflow-auto rounded border border-gray-700">
                    <Table>
                      <TableHeader>
                        {results.length > 0 && (
                          <TableRow className="bg-gray-700/50 hover:bg-gray-700/50">
                            {Object.keys(results[0]).map((key) => (
                              <TableHead key={key} className="text-gray-300">
                                {key}
                              </TableHead>
                            ))}
                          </TableRow>
                        )}
                      </TableHeader>
                      <TableBody>
                        {results.map((row, i) => (
                          <TableRow key={i} className="border-gray-700 hover:bg-gray-700/30">
                            {Object.values(row).map((value: any, j) => (
                              <TableCell key={j} className="text-gray-300">
                                {value}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DatabaseBrowser;
