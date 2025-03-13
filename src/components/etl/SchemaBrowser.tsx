
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Database, Table as TableIcon, Key, ArrowDownUp, Code, MessageSquare } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import DatabaseBrowser from "./DatabaseBrowser";

// Mock table schema data
const mockTableSchemas = {
  customers: [
    { column: 'customer_id', type: 'INT', primary: true, nullable: false, default: 'AUTO_INCREMENT' },
    { column: 'name', type: 'VARCHAR(255)', primary: false, nullable: false, default: 'NULL' },
    { column: 'email', type: 'VARCHAR(255)', primary: false, nullable: false, default: 'NULL' },
    { column: 'phone', type: 'VARCHAR(50)', primary: false, nullable: true, default: 'NULL' },
    { column: 'address', type: 'TEXT', primary: false, nullable: true, default: 'NULL' },
    { column: 'created_at', type: 'TIMESTAMP', primary: false, nullable: false, default: 'CURRENT_TIMESTAMP' },
  ],
  orders: [
    { column: 'order_id', type: 'INT', primary: true, nullable: false, default: 'AUTO_INCREMENT' },
    { column: 'customer_id', type: 'INT', primary: false, nullable: false, default: 'NULL' },
    { column: 'order_date', type: 'TIMESTAMP', primary: false, nullable: false, default: 'CURRENT_TIMESTAMP' },
    { column: 'status', type: 'VARCHAR(50)', primary: false, nullable: false, default: "'pending'" },
    { column: 'total_amount', type: 'DECIMAL(10,2)', primary: false, nullable: false, default: '0.00' },
  ],
  products: [
    { column: 'product_id', type: 'INT', primary: true, nullable: false, default: 'AUTO_INCREMENT' },
    { column: 'name', type: 'VARCHAR(255)', primary: false, nullable: false, default: 'NULL' },
    { column: 'description', type: 'TEXT', primary: false, nullable: true, default: 'NULL' },
    { column: 'price', type: 'DECIMAL(10,2)', primary: false, nullable: false, default: '0.00' },
    { column: 'stock', type: 'INT', primary: false, nullable: false, default: '0' },
    { column: 'category', type: 'VARCHAR(100)', primary: false, nullable: true, default: 'NULL' },
  ],
  order_items: [
    { column: 'item_id', type: 'INT', primary: true, nullable: false, default: 'AUTO_INCREMENT' },
    { column: 'order_id', type: 'INT', primary: false, nullable: false, default: 'NULL' },
    { column: 'product_id', type: 'INT', primary: false, nullable: false, default: 'NULL' },
    { column: 'quantity', type: 'INT', primary: false, nullable: false, default: '1' },
    { column: 'price', type: 'DECIMAL(10,2)', primary: false, nullable: false, default: '0.00' },
  ],
  users: [
    { column: 'user_id', type: 'INT', primary: true, nullable: false, default: 'AUTO_INCREMENT' },
    { column: 'username', type: 'VARCHAR(50)', primary: false, nullable: false, default: 'NULL' },
    { column: 'password', type: 'VARCHAR(255)', primary: false, nullable: false, default: 'NULL' },
    { column: 'email', type: 'VARCHAR(255)', primary: false, nullable: false, default: 'NULL' },
    { column: 'role', type: 'VARCHAR(20)', primary: false, nullable: false, default: "'user'" },
    { column: 'created_at', type: 'TIMESTAMP', primary: false, nullable: false, default: 'CURRENT_TIMESTAMP' },
  ],
};

// Mock database tables with row counts
const mockTables = [
  { name: 'customers', rowCount: 1250 },
  { name: 'orders', rowCount: 8432 },
  { name: 'products', rowCount: 374 },
  { name: 'order_items', rowCount: 15789 },
  { name: 'users', rowCount: 843 },
];

interface SchemaBrowserProps {
  connectionName: string;
  connectionType: string;
  isOpen: boolean;
  onClose: () => void;
}

const SchemaBrowser: React.FC<SchemaBrowserProps> = ({ 
  connectionName, 
  connectionType, 
  isOpen, 
  onClose 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('schema');
  
  // Filter tables based on search term
  const filteredTables = mockTables.filter(table => 
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl h-[80vh] bg-gray-800 border-gray-700 text-white p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-700">
          <DialogTitle className="text-xl flex items-center">
            <Database className="h-5 w-5 mr-2 text-blue-400" />
            {connectionName} - {connectionType}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex h-[calc(80vh-80px)]">
          {/* Left sidebar - Tables list */}
          <div className="w-64 border-r border-gray-700 p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search tables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
              <TableIcon className="h-4 w-4 mr-2" />
              Tables
            </h3>
            
            <div className="space-y-1 overflow-y-auto max-h-[calc(80vh-200px)]">
              {filteredTables.map((table) => (
                <div
                  key={table.name}
                  className={`flex items-center justify-between rounded-md px-2 py-1.5 text-sm cursor-pointer ${
                    selectedTable === table.name ? 'bg-blue-900/50 text-blue-200' : 'hover:bg-gray-700'
                  }`}
                  onClick={() => handleTableSelect(table.name)}
                >
                  <div className="flex items-center">
                    <TableIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span className={selectedTable === table.name ? 'text-blue-200' : 'text-gray-200'}>
                      {table.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{table.rowCount} rows</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1 overflow-hidden">
            {selectedTable ? (
              <div className="h-full flex flex-col">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                  <TabsList className="bg-gray-700 mb-2 mx-4 mt-4">
                    <TabsTrigger value="schema" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300">
                      <Database className="h-4 w-4 mr-2" />
                      Schema
                    </TabsTrigger>
                    <TabsTrigger value="query" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300">
                      <Code className="h-4 w-4 mr-2" />
                      Query
                    </TabsTrigger>
                    <TabsTrigger value="transform" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      AI Transform
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="schema" className="flex-1 p-4 overflow-auto">
                    <div className="rounded-md border border-gray-700 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-700/50 hover:bg-gray-700/50">
                            <TableHead className="text-gray-300 w-10"></TableHead>
                            <TableHead className="text-gray-300">Column</TableHead>
                            <TableHead className="text-gray-300">Type</TableHead>
                            <TableHead className="text-gray-300">Nullable</TableHead>
                            <TableHead className="text-gray-300">Default</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockTableSchemas[selectedTable as keyof typeof mockTableSchemas]?.map((column, index) => (
                            <TableRow key={index} className="border-gray-700 hover:bg-gray-700/30">
                              <TableCell>
                                {column.primary && <Key className="h-4 w-4 text-yellow-400" />}
                              </TableCell>
                              <TableCell className="font-medium text-gray-200">{column.column}</TableCell>
                              <TableCell className="text-gray-300">{column.type}</TableCell>
                              <TableCell className="text-gray-300">{column.nullable ? 'YES' : 'NO'}</TableCell>
                              <TableCell className="text-gray-300">{column.default}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="query" className="m-0 p-4 flex-1 overflow-auto">
                    <DatabaseBrowser 
                      tables={mockTables}
                      onSelectTable={handleTableSelect}
                    />
                  </TabsContent>
                  
                  <TabsContent value="transform" className="m-0 p-4 flex-1 overflow-auto">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium text-white mb-2">AI-Powered SQL Transformation</h3>
                        <p className="text-gray-400 mb-4">
                          Describe what you want to do with this table in plain English, and our AI will generate the SQL for you.
                        </p>
                        
                        <div className="space-y-4">
                          <Textarea 
                            placeholder="E.g., Show me all customers who have made more than 3 orders in the last month"
                            className="min-h-[100px] bg-gray-700 border-gray-600 text-white"
                          />
                          
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            Generate SQL
                          </Button>
                          
                          <div className="mt-6 rounded-md border border-gray-700 bg-gray-800/50 p-4">
                            <h4 className="text-sm font-medium text-gray-300 mb-2">Generated SQL:</h4>
                            <pre className="bg-gray-900 p-4 rounded text-green-400 overflow-x-auto text-sm">
{`SELECT 
  c.customer_id,
  c.name,
  c.email,
  COUNT(o.order_id) as order_count
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
GROUP BY c.customer_id, c.name, c.email
HAVING COUNT(o.order_id) > 3
ORDER BY order_count DESC;`}
                            </pre>
                            
                            <div className="flex justify-end mt-4">
                              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700 mr-2">
                                Edit SQL
                              </Button>
                              <Button className="bg-blue-600 hover:bg-blue-700">
                                Run Query
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <TableIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white">Select a table</h3>
                  <p className="text-gray-400 mt-1">Choose a table from the sidebar to view its schema and data</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SchemaBrowser;
