import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft, PlayCircle, Download, FileCode, Database, Copy } from 'lucide-react';
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
  { 
    name: 'customers', 
    rowCount: 1243,
    schema: [
      { name: 'id', type: 'integer', isPrimary: true },
      { name: 'name', type: 'text' },
      { name: 'email', type: 'text' },
      { name: 'phone', type: 'text' },
      { name: 'address', type: 'text' },
      { name: 'orders', type: 'integer' },
      { name: 'total_spent', type: 'numeric' }
    ]
  },
  { 
    name: 'orders', 
    rowCount: 5210,
    schema: [
      { name: 'id', type: 'integer', isPrimary: true },
      { name: 'customer_id', type: 'integer', isReference: true, references: 'customers.id' },
      { name: 'date', type: 'date' },
      { name: 'status', type: 'text' },
      { name: 'total', type: 'numeric' }
    ]
  },
  { 
    name: 'products', 
    rowCount: 487,
    schema: [
      { name: 'id', type: 'integer', isPrimary: true },
      { name: 'name', type: 'text' },
      { name: 'category', type: 'text' },
      { name: 'price', type: 'numeric' },
      { name: 'stock', type: 'integer' }
    ]
  },
  { 
    name: 'order_items', 
    rowCount: 18652,
    schema: [
      { name: 'id', type: 'integer', isPrimary: true },
      { name: 'order_id', type: 'integer', isReference: true, references: 'orders.id' },
      { name: 'product_id', type: 'integer', isReference: true, references: 'products.id' },
      { name: 'quantity', type: 'integer' },
      { name: 'price', type: 'numeric' }
    ]
  },
  { 
    name: 'employees', 
    rowCount: 42,
    schema: [
      { name: 'id', type: 'integer', isPrimary: true },
      { name: 'name', type: 'text' },
      { name: 'position', type: 'text' },
      { name: 'department', type: 'text' },
      { name: 'hire_date', type: 'date' }
    ]
  },
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

// Mock natural language queries and their corresponding SQL translations
const mockNLTranslations = {
  "find customers who spent more than 100": 
    `SELECT *
FROM customers
WHERE total_spent > 100
ORDER BY total_spent DESC
LIMIT 10`,

  "show all orders from customer john": 
    `SELECT o.*
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE c.name LIKE '%john%'
ORDER BY o.date DESC`,

  "list products with low stock": 
    `SELECT id, name, category, price, stock
FROM products
WHERE stock < 50
ORDER BY stock ASC`,

  "get sales representatives": 
    `SELECT name, position, department, hire_date
FROM employees
WHERE position LIKE '%Sales%'
ORDER BY hire_date ASC`,

  "which products are in the electronics category": 
    `SELECT * 
FROM products
WHERE category = 'Electronics'
ORDER BY price DESC`,

  "select names starting with letter j": 
    `SELECT id, name, email
FROM customers
WHERE name LIKE 'J%'
ORDER BY name ASC`,
    
  "show total sales by product": 
    `SELECT p.name, SUM(oi.quantity) as total_sold, SUM(oi.price) as revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.id
GROUP BY p.name
ORDER BY revenue DESC`
};

// Mock database engine to simulate SQL query execution
class MockDatabaseEngine {
  constructor(mockData) {
    this.tables = mockData;
  }

  executeQuery(query) {
    console.log('Executing query:', query);
    const queryLower = query.toLowerCase();
    
    // Simple lexer to tokenize the query
    const tokens = queryLower.split(/\s+/);
    
    try {
      // Basic SELECT query parser
      if (tokens.includes('select')) {
        // Check if it's a JOIN query
        if (tokens.includes('join')) {
          return this.handleJoinQuery(queryLower);
        }
        
        // Extract the table name (FROM clause)
        const fromIndex = tokens.indexOf('from');
        if (fromIndex === -1 || fromIndex + 1 >= tokens.length) {
          throw new Error('Invalid query: Missing FROM clause or table name');
        }
        
        const tableName = tokens[fromIndex + 1].replace(/[;,]/g, '');
        
        // Ensure the table exists
        if (!this.tables[tableName]) {
          throw new Error(`Table "${tableName}" not found`);
        }
        
        let result = [...this.tables[tableName]];
        
        // Apply WHERE clause if present
        if (tokens.includes('where')) {
          result = this.applyWhereClause(result, queryLower);
        }
        
        // Apply ORDER BY clause if present
        if (tokens.includes('order') && tokens.includes('by')) {
          result = this.applyOrderByClause(result, queryLower);
        }
        
        // Apply LIMIT clause if present
        if (tokens.includes('limit')) {
          const limitIndex = tokens.indexOf('limit');
          if (limitIndex + 1 < tokens.length) {
            const limit = parseInt(tokens[limitIndex + 1]);
            if (!isNaN(limit)) {
              result = result.slice(0, limit);
            }
          }
        }
        
        return result;
      }
      
      // Handle other query types (not implemented in this mock)
      throw new Error('Only SELECT queries are supported in this demo');
      
    } catch (error) {
      console.error('Query execution error:', error);
      throw error;
    }
  }
  
  applyWhereClause(data, query) {
    // Very simple WHERE clause parser - only handles basic conditions
    const whereIndex = query.indexOf('where');
    if (whereIndex === -1) return data;
    
    let whereClause = query.substring(whereIndex + 5);
    
    // Extract the condition before ORDER BY or LIMIT if present
    if (whereClause.includes('order by')) {
      whereClause = whereClause.substring(0, whereClause.indexOf('order by'));
    }
    if (whereClause.includes('limit')) {
      whereClause = whereClause.substring(0, whereClause.indexOf('limit'));
    }
    
    whereClause = whereClause.trim();
    
    return data.filter(row => {
      // Handle LIKE operator
      if (whereClause.includes('like')) {
        const [field, pattern] = whereClause.split('like').map(s => s.trim());
        const fieldName = field.trim();
        // Extract the pattern removing quotes
        const likePattern = pattern.replace(/['"]/g, '').replace(/;$/, '');
        
        if (likePattern.startsWith('%') && likePattern.endsWith('%')) {
          // Contains
          const searchTerm = likePattern.slice(1, -1).toLowerCase();
          return String(row[fieldName]).toLowerCase().includes(searchTerm);
        } else if (likePattern.startsWith('%')) {
          // Ends with
          const searchTerm = likePattern.slice(1).toLowerCase();
          return String(row[fieldName]).toLowerCase().endsWith(searchTerm);
        } else if (likePattern.endsWith('%')) {
          // Starts with
          const searchTerm = likePattern.slice(0, -1).toLowerCase();
          return String(row[fieldName]).toLowerCase().startsWith(searchTerm);
        }
        
        return String(row[fieldName]) === likePattern;
      }
      
      // Handle greater than operator
      if (whereClause.includes('>')) {
        const [field, value] = whereClause.split('>').map(s => s.trim());
        const fieldName = field.trim();
        const compareValue = parseFloat(value);
        
        if (!isNaN(compareValue)) {
          return parseFloat(row[fieldName]) > compareValue;
        }
      }
      
      // Handle equals operator
      if (whereClause.includes('=')) {
        const [field, value] = whereClause.split('=').map(s => s.trim());
        const fieldName = field.trim();
        const compareValue = value.replace(/['"]/g, '');
        
        return String(row[fieldName]) === compareValue;
      }
      
      return true;
    });
  }
  
  applyOrderByClause(data, query) {
    const orderByIndex = query.indexOf('order by');
    if (orderByIndex === -1) return data;
    
    let orderByClause = query.substring(orderByIndex + 8);
    
    // Extract the ordering field and direction before LIMIT if present
    if (orderByClause.includes('limit')) {
      orderByClause = orderByClause.substring(0, orderByClause.indexOf('limit'));
    }
    
    orderByClause = orderByClause.trim();
    
    const [field, direction] = orderByClause.split(/\s+/);
    const isDescending = direction && direction.toLowerCase() === 'desc';
    
    return [...data].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];
      
      // Sort numerically if values are numbers
      if (!isNaN(valueA) && !isNaN(valueB)) {
        return isDescending ? valueB - valueA : valueA - valueB;
      }
      
      // Otherwise sort alphabetically
      const strA = String(valueA);
      const strB = String(valueB);
      
      return isDescending ? strB.localeCompare(strA) : strA.localeCompare(strB);
    });
  }
  
  handleJoinQuery(query) {
    // This is a simplified JOIN handler for demo purposes
    // In a real implementation, this would properly parse the query and execute it
    
    // For the demo, we'll handle a few specific JOIN patterns
    if (query.includes('customers') && query.includes('orders')) {
      // Join customers and orders
      const result = [];
      
      for (const order of this.tables.orders) {
        const customer = this.tables.customers.find(c => c.id === order.customer_id);
        if (customer) {
          result.push({
            order_id: order.id,
            order_date: order.date,
            order_status: order.status,
            order_total: order.total,
            customer_id: customer.id,
            customer_name: customer.name,
            customer_email: customer.email
          });
        }
      }
      
      // Filter by name if specified
      if (query.includes('where') && query.includes('like')) {
        const nameMatch = query.match(/name\s+like\s+['"]%([^%]+)%['"]/i);
        if (nameMatch && nameMatch[1]) {
          const searchName = nameMatch[1].toLowerCase();
          return result.filter(r => r.customer_name.toLowerCase().includes(searchName));
        }
      }
      
      // Apply ordering
      if (query.includes('order by') && query.includes('date')) {
        const isDesc = query.includes('desc');
        result.sort((a, b) => {
          const dateA = new Date(a.order_date);
          const dateB = new Date(b.order_date);
          return isDesc ? dateB - dateA : dateA - dateB;
        });
      }
      
      return result;
    }
    
    if (query.includes('products') && query.includes('order_items')) {
      // Join products and order_items to get sales data
      const result = [];
      const productSales = {};
      
      // Calculate total sales by product
      for (const item of this.tables.order_items) {
        const product = this.tables.products.find(p => p.id === item.product_id);
        if (product) {
          if (!productSales[product.name]) {
            productSales[product.name] = {
              name: product.name,
              total_sold: 0,
              revenue: 0
            };
          }
          
          productSales[product.name].total_sold += item.quantity;
          productSales[product.name].revenue += item.price;
        }
      }
      
      // Convert to array
      for (const productName in productSales) {
        result.push(productSales[productName]);
      }
      
      // Sort by revenue descending
      result.sort((a, b) => b.revenue - a.revenue);
      
      return result;
    }
    
    // Default: return an empty result for unsupported joins
    return [];
  }
}

const SqlExplorer = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM customers LIMIT 100');
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState<string>('');
  const [generatedSql, setGeneratedSql] = useState<string>('');
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('sql');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [tableSchema, setTableSchema] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize database engine
  const dbEngine = new MockDatabaseEngine(mockTableData);
  
  // Filter tables based on search term
  const filteredTables = mockTables.filter(table => 
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Load table data when a table is selected
  useEffect(() => {
    if (selectedTable) {
      const table = mockTables.find(t => t.name === selectedTable);
      if (table) {
        setTableSchema(table.schema);
        setSqlQuery(`SELECT * FROM ${selectedTable} LIMIT 100`);
        
        try {
          const results = dbEngine.executeQuery(`SELECT * FROM ${selectedTable} LIMIT 100`);
          setQueryResults(results);
          setErrorMessage(null);
        } catch (error) {
          console.error('Error executing query:', error);
          setErrorMessage(String(error));
          setQueryResults([]);
        }
      }
    }
  }, [selectedTable]);

  const handleSelectTable = (tableName: string) => {
    setSelectedTable(tableName);
  };

  const handleRunQuery = () => {
    setIsExecuting(true);
    setErrorMessage(null);
    
    console.log('Running query:', sqlQuery);
    
    // Simulate processing time
    setTimeout(() => {
      try {
        const results = dbEngine.executeQuery(sqlQuery);
        setQueryResults(results);
        toast.success('Query executed successfully');
      } catch (error) {
        console.error('Error executing query:', error);
        setErrorMessage(String(error));
        setQueryResults([]);
        toast.error('Error executing query');
      } finally {
        setIsExecuting(false);
      }
    }, 600);
  };

  const handleGenerateSql = () => {
    if (!naturalLanguageQuery) {
      toast.error('Please enter a query in natural language');
      return;
    }
    
    setIsExecuting(true);
    setErrorMessage(null);
    
    // Find a close match in our mock translations
    setTimeout(() => {
      try {
        let generatedQuery = '';
        const query = naturalLanguageQuery.toLowerCase();
        
        // Find the most similar mock query
        for (const [nlQuery, sql] of Object.entries(mockNLTranslations)) {
          if (query.includes(nlQuery) || nlQuery.includes(query)) {
            generatedQuery = sql;
            break;
          }
        }
        
        // If no match found, use a default query
        if (!generatedQuery) {
          if (query.includes('customer')) {
            generatedQuery = mockNLTranslations["find customers who spent more than 100"];
          } else if (query.includes('product')) {
            generatedQuery = mockNLTranslations["which products are in the electronics category"];
          } else if (query.includes('order')) {
            generatedQuery = mockNLTranslations["show all orders from customer john"];
          } else if (query.includes('employee')) {
            generatedQuery = mockNLTranslations["get sales representatives"];
          } else if (query.includes('name')) {
            generatedQuery = mockNLTranslations["select names starting with letter j"];
          } else {
            generatedQuery = `SELECT * FROM customers LIMIT 10`;
          }
        }
        
        setGeneratedSql(generatedQuery);
        setSqlQuery(generatedQuery);
        toast.success('SQL generated successfully');
      } catch (error) {
        console.error('Error generating SQL:', error);
        setErrorMessage(String(error));
        toast.error('Error generating SQL');
      } finally {
        setIsExecuting(false);
      }
    }, 800);
  };

  const handleRunGeneratedSql = () => {
    if (generatedSql) {
      setSqlQuery(generatedSql);
      setActiveTab('sql');
      handleRunQuery();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy');
      });
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
            
            {/* Table Schema */}
            {selectedTable && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-white mb-2">Table Schema</h3>
                <div className="bg-black/20 rounded-md p-2 text-xs font-mono">
                  {tableSchema.map((column) => (
                    <div key={column.name} className="flex justify-between text-gray-300 py-1 border-b border-gray-800">
                      <span>{column.name}</span>
                      <span className="text-gray-500">{column.type}{column.isPrimary ? ' (PK)' : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                  <Button variant="outline" className="text-gray-300" onClick={() => copyToClipboard(sqlQuery)}>
                    <Copy size={16} className="mr-2" />
                    Copy
                  </Button>
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
                      <div className="flex items-center justify-between text-sm font-medium text-gray-400 mb-2">
                        <h3>Generated SQL:</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-gray-400 hover:text-white"
                          onClick={() => copyToClipboard(generatedSql)}
                        >
                          <Copy size={14} />
                        </Button>
                      </div>
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

            {/* Error message */}
            {errorMessage && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-900 rounded-md text-red-300">
                <p className="font-medium mb-1">Error executing query:</p>
                <pre className="text-sm overflow-x-auto">{errorMessage}</pre>
              </div>
            )}

            {/* Results table */}
            {queryResults.length >
 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Query Results</h3>
                  <span className="text-sm text-gray-400">{queryResults.length} rows</span>
                </div>
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
