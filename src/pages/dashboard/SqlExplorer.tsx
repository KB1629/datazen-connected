
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft, PlayCircle, Download, FileCode, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock database tables with schema information
const mockTables = [
  { name: 'customers', rowCount: 1243 },
  { name: 'orders', rowCount: 5210 },
  { name: 'products', rowCount: 487 },
  { name: 'order_items', rowCount: 18652 },
  { name: 'employees', rowCount: 42 },
];

// Mock data for each table
const mockTableData = {
  customers: [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-1234', address: '123 Main St', orders: 5, total_spent: 529.95 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-5678', address: '456 Oak Ave', orders: 3, total_spent: 129.85 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-9012', address: '789 Pine Rd', orders: 12, total_spent: 1045.20 },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', phone: '555-3456', address: '101 Elm St', orders: 8, total_spent: 839.50 },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', phone: '555-7890', address: '202 Maple Dr', orders: 1, total_spent: 49.99 },
  ],
  orders: [
    { id: 1, customer_id: 1, date: '2023-05-15', status: 'completed', total: 129.99 },
    { id: 2, customer_id: 3, date: '2023-05-16', status: 'shipped', total: 259.99 },
    { id: 3, customer_id: 2, date: '2023-05-17', status: 'processing', total: 59.99 },
    { id: 4, customer_id: 1, date: '2023-05-18', status: 'completed', total: 399.96 },
    { id: 5, customer_id: 4, date: '2023-05-19', status: 'shipped', total: 839.50 },
  ],
  products: [
    { id: 1, name: 'Laptop', category: 'Electronics', price: 999.99, stock: 45 },
    { id: 2, name: 'Smartphone', category: 'Electronics', price: 599.99, stock: 120 },
    { id: 3, name: 'Coffee Maker', category: 'Kitchen', price: 79.99, stock: 32 },
    { id: 4, name: 'Running Shoes', category: 'Apparel', price: 89.99, stock: 65 },
    { id: 5, name: 'Bluetooth Speaker', category: 'Electronics', price: 49.99, stock: 80 },
  ],
  order_items: [
    { id: 1, order_id: 1, product_id: 2, quantity: 1, price: 599.99 },
    { id: 2, order_id: 1, product_id: 3, quantity: 1, price: 79.99 },
    { id: 3, order_id: 2, product_id: 1, quantity: 1, price: 999.99 },
    { id: 4, order_id: 3, product_id: 5, quantity: 2, price: 99.98 },
    { id: 5, order_id: 4, product_id: 4, quantity: 1, price: 89.99 },
  ],
  employees: [
    { id: 1, name: 'Michael Scott', position: 'Regional Manager', department: 'Management', hire_date: '2005-03-24' },
    { id: 2, name: 'Jim Halpert', position: 'Sales Representative', department: 'Sales', hire_date: '2006-01-15' },
    { id: 3, name: 'Pam Beesly', position: 'Receptionist', department: 'Administration', hire_date: '2005-05-10' },
    { id: 4, name: 'Dwight Schrute', position: 'Assistant Regional Manager', department: 'Sales', hire_date: '2005-04-01' },
    { id: 5, name: 'Angela Martin', position: 'Accountant', department: 'Finance', hire_date: '2005-06-12' },
  ]
};

// Sample joins for mock data
const mockJoinQueries = {
  customersWithOrders: [
    { id: 1, name: 'John Doe', email: 'john@example.com', order_count: 5, total_spent: 529.95 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', order_count: 3, total_spent: 129.85 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', order_count: 12, total_spent: 1045.20 },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', order_count: 8, total_spent: 839.50 },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', order_count: 1, total_spent: 49.99 },
  ]
};

const SqlExplorer = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM customers LIMIT 100');
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState<string>('');
  const [generatedSql, setGeneratedSql] = useState<string>('');
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('sql');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  // Filter tables based on search term
  const filteredTables = mockTables.filter(table => 
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Load table data when a table is selected
  useEffect(() => {
    if (selectedTable) {
      const tableData = mockTableData[selectedTable as keyof typeof mockTableData] || [];
      setQueryResults(tableData);
      setSqlQuery(`SELECT * FROM ${selectedTable} LIMIT 100`);
    }
  }, [selectedTable]);

  const handleSelectTable = (tableName: string) => {
    setSelectedTable(tableName);
  };

  const handleRunQuery = () => {
    setIsExecuting(true);
    console.log('Running query:', sqlQuery);
    
    // Simulate processing time
    setTimeout(() => {
      try {
        // Very basic SQL parsing to demonstrate functionality
        const query = sqlQuery.toLowerCase();
        
        // Check if it's a join query between customers and orders
        if (
          query.includes('join orders') && 
          query.includes('customers') && 
          query.includes('sum') && 
          query.includes('count')
        ) {
          setQueryResults(mockJoinQueries.customersWithOrders);
        }
        // Check which table is being queried
        else if (query.includes('from customers')) {
          setQueryResults(mockTableData.customers);
        } 
        else if (query.includes('from orders')) {
          setQueryResults(mockTableData.orders);
        }
        else if (query.includes('from products')) {
          setQueryResults(mockTableData.products);
        }
        else if (query.includes('from order_items')) {
          setQueryResults(mockTableData.order_items);
        }
        else if (query.includes('from employees')) {
          setQueryResults(mockTableData.employees);
        }
        else {
          // Default to customers if table not recognized
          setQueryResults(mockTableData.customers);
        }
        toast.success('Query executed successfully');
      } catch (error) {
        console.error('Error executing query:', error);
        toast.error('Error executing query');
        setQueryResults([]);
      } finally {
        setIsExecuting(false);
      }
    }, 800);
  };

  const handleGenerateSql = () => {
    if (!naturalLanguageQuery) {
      toast.error('Please enter a query in natural language');
      return;
    }
    
    setIsExecuting(true);
    
    // Simulate generating SQL from natural language
    setTimeout(() => {
      // Different SQL generation based on query content
      let generatedQuery = '';
      
      if (naturalLanguageQuery.toLowerCase().includes('customer') && naturalLanguageQuery.toLowerCase().includes('order')) {
        generatedQuery = `SELECT c.name, c.email, COUNT(o.id) as order_count, SUM(o.total) as total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.id
HAVING SUM(o.total) > 100
ORDER BY total_spent DESC`;
      } 
      else if (naturalLanguageQuery.toLowerCase().includes('product') && naturalLanguageQuery.toLowerCase().includes('stock')) {
        generatedQuery = `SELECT id, name, category, price, stock
FROM products
WHERE stock < 50
ORDER BY stock ASC`;
      }
      else if (naturalLanguageQuery.toLowerCase().includes('employee')) {
        generatedQuery = `SELECT name, position, department, hire_date
FROM employees
WHERE department = 'Sales'
ORDER BY hire_date ASC`;
      }
      else {
        generatedQuery = `SELECT * 
FROM customers 
WHERE total_spent > 100 
ORDER BY total_spent DESC 
LIMIT 10`;
      }
      
      setGeneratedSql(generatedQuery);
      setSqlQuery(generatedQuery);
      setIsExecuting(false);
      toast.success('SQL generated successfully');
    }, 1000);
  };

  const handleRunGeneratedSql = () => {
    if (generatedSql) {
      setSqlQuery(generatedSql);
      setActiveTab('sql');
      handleRunQuery();
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">SQL Explorer</h1>
            <p className="text-gray-400">Browse your database structure and run queries</p>
          </div>
          <Link to="/connections">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Connections
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Table browser */}
          <div className="bg-sidebar-background border border-sidebar-border rounded-lg p-4">
            <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Database size={18} />
              Database Tables
            </h2>
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tables..."
                className="pl-8 bg-sidebar-accent border-sidebar-border text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2 mt-4 max-h-[60vh] overflow-y-auto pr-2">
              {filteredTables.map((table) => (
                <Card
                  key={table.name}
                  onClick={() => handleSelectTable(table.name)}
                  className={`p-2.5 cursor-pointer flex justify-between items-center transition-colors ${
                    selectedTable === table.name
                      ? 'bg-primary/20 text-primary border-primary'
                      : 'bg-sidebar-accent text-gray-300 hover:bg-sidebar-accent/80 border-sidebar-border'
                  }`}
                >
                  <span>{table.name}</span>
                  <span className="text-xs text-gray-500">{table.rowCount.toLocaleString()} rows</span>
                </Card>
              ))}
            </div>
          </div>

          {/* Query editor */}
          <div className="md:col-span-2 bg-sidebar-background border border-sidebar-border rounded-lg p-4">
            <Tabs defaultValue="sql" className="w-full" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="mb-4 bg-sidebar-accent">
                <TabsTrigger value="sql">SQL Query</TabsTrigger>
                <TabsTrigger value="nl">Natural Language</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sql" className="space-y-4">
                <Textarea
                  className="w-full h-40 p-3 bg-sidebar-accent text-white rounded-md border border-sidebar-border resize-none font-mono"
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  placeholder="Enter your SQL query here..."
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" className="text-gray-300">
                    <Download size={16} className="mr-2" />
                    Save Query
                  </Button>
                  <Button 
                    onClick={handleRunQuery} 
                    className="bg-primary hover:bg-primary/90"
                    disabled={isExecuting}
                  >
                    <PlayCircle size={16} className="mr-2" />
                    {isExecuting ? 'Running...' : 'Run Query'}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="nl" className="space-y-4">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Ask a question about your data in plain English..."
                    className="bg-sidebar-accent border-sidebar-border text-white h-24"
                    value={naturalLanguageQuery}
                    onChange={(e) => setNaturalLanguageQuery(e.target.value)}
                  />
                  <Button 
                    onClick={handleGenerateSql} 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isExecuting}
                  >
                    <FileCode size={16} className="mr-2" />
                    {isExecuting ? 'Generating...' : 'Generate SQL'}
                  </Button>
                  
                  {generatedSql && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Generated SQL:</h3>
                      <div className="bg-sidebar-accent p-3 rounded-md border border-sidebar-border font-mono text-sm text-white overflow-x-auto">
                        <pre className="whitespace-pre-wrap">{generatedSql}</pre>
                      </div>
                      <Button 
                        onClick={handleRunGeneratedSql} 
                        className="mt-3 bg-primary hover:bg-primary/90"
                      >
                        <PlayCircle size={16} className="mr-2" />
                        Run Generated SQL
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Results table */}
            {queryResults.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-white mb-4">Query Results</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-sidebar-accent text-gray-300 text-left">
                        {Object.keys(queryResults[0]).map((key) => (
                          <TableHead key={key} className="border-b border-sidebar-border">
                            {key}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {queryResults.map((row, i) => (
                        <TableRow key={i} className="text-gray-300 hover:bg-sidebar-accent/50">
                          {Object.values(row).map((value: any, j) => (
                            <TableCell key={j} className="border-b border-sidebar-border">
                              {String(value)}
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SqlExplorer;
