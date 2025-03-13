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

const nlPatterns = [
  {
    pattern: /customer.*spent more than \d+/i,
    sqlTemplate: (match: string) => {
      const amount = match.match(/\d+/)?.[0] || '100';
      return `SELECT *
FROM customers
WHERE total_spent > ${amount}
ORDER BY total_spent DESC
LIMIT 10`;
    }
  },
  {
    pattern: /show.*orders.*from customer (\w+)/i,
    sqlTemplate: (match: string) => {
      const customerName = match.match(/from customer (\w+)/i)?.[1]?.toLowerCase() || 'john';
      return `SELECT o.*
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE c.name LIKE '%${customerName}%'
ORDER BY o.date DESC`;
    }
  },
  {
    pattern: /.*products.*low stock/i,
    sqlTemplate: () => {
      return `SELECT id, name, category, price, stock
FROM products
WHERE stock < 50
ORDER BY stock ASC`;
    }
  },
  {
    pattern: /customer_id.*status completed.*orders/i,
    sqlTemplate: () => {
      return `SELECT customer_id, date, total
FROM orders
WHERE status = 'completed'
ORDER BY date DESC`;
    }
  },
  {
    pattern: /completed orders/i,
    sqlTemplate: () => {
      return `SELECT *
FROM orders
WHERE status = 'completed'
ORDER BY date DESC`;
    }
  },
  {
    pattern: /electronics.*products/i,
    sqlTemplate: () => {
      return `SELECT * 
FROM products
WHERE category = 'Electronics'
ORDER BY price DESC`;
    }
  },
  {
    pattern: /sales representatives/i,
    sqlTemplate: () => {
      return `SELECT name, position, department, hire_date
FROM employees
WHERE position LIKE '%Sales%'
ORDER BY hire_date ASC`;
    }
  },
  {
    pattern: /total sales by product/i,
    sqlTemplate: () => {
      return `SELECT p.name, SUM(oi.quantity) as total_sold, SUM(oi.price) as revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.id
GROUP BY p.name
ORDER BY revenue DESC`;
    }
  }
];

class MockDatabaseEngine {
  private tableData: Record<string, any[]>;

  constructor(tableData: Record<string, any[]>) {
    this.tableData = tableData;
  }

  executeQuery(query: string) {
    console.log('Executing query:', query);
    const queryLower = query.toLowerCase();
    
    try {
      if (queryLower.includes('select')) {
        if (queryLower.includes('join')) {
          return this.handleJoinQuery(queryLower);
        }
        
        const fromMatch = queryLower.match(/from\s+(\w+)/i);
        if (!fromMatch) {
          throw new Error('Invalid query: Missing FROM clause or table name');
        }
        
        const tableName = fromMatch[1];
        
        if (!this.tableData[tableName]) {
          throw new Error(`Table "${tableName}" not found`);
        }
        
        let result = [...this.tableData[tableName]];
        
        if (queryLower.includes('where')) {
          result = this.applyWhereClause(result, queryLower);
        }
        
        if (queryLower.includes('order by')) {
          result = this.applyOrderByClause(result, queryLower);
        }
        
        const limitMatch = queryLower.match(/limit\s+(\d+)/i);
        if (limitMatch) {
          const limit = parseInt(limitMatch[1], 10);
          if (!isNaN(limit)) {
            result = result.slice(0, limit);
          }
        }
        
        return result;
      }
      
      throw new Error('Only SELECT queries are supported in this demo');
      
    } catch (error) {
      console.error('Query execution error:', error);
      throw error;
    }
  }
  
  applyWhereClause(data: any[], query: string) {
    const whereMatch = query.match(/where\s+(.*?)(?:order by|limit|$)/i);
    if (!whereMatch) return data;
    
    const whereClause = whereMatch[1].trim();
    
    return data.filter(row => {
      if (whereClause.includes('like')) {
        const likeMatch = whereClause.match(/(\w+)\s+like\s+['"']%?([^%'"]*)%?['"']/i);
        if (likeMatch) {
          const [_, fieldName, pattern] = likeMatch;
          const rowValue = String(row[fieldName]).toLowerCase();
          
          if (whereClause.includes("'%" + pattern + "%'") || whereClause.includes('"' + pattern + '%"')) {
            return rowValue.includes(pattern.toLowerCase());
          } else if (whereClause.includes("'%" + pattern + "'") || whereClause.includes('"' + pattern + '"')) {
            return rowValue.endsWith(pattern.toLowerCase());
          } else if (whereClause.includes("'" + pattern + "%'") || whereClause.includes('"' + pattern + '%"')) {
            return rowValue.startsWith(pattern.toLowerCase());
          }
        }
      }
      
      if (whereClause.includes('>')) {
        const gtMatch = whereClause.match(/(\w+)\s*>\s*(\d+)/i);
        if (gtMatch) {
          const [_, fieldName, value] = gtMatch;
          return parseFloat(String(row[fieldName])) > parseFloat(value);
        }
      }
      
      if (whereClause.includes('<')) {
        const ltMatch = whereClause.match(/(\w+)\s*<\s*(\d+)/i);
        if (ltMatch) {
          const [_, fieldName, value] = ltMatch;
          return parseFloat(String(row[fieldName])) < parseFloat(value);
        }
      }
      
      if (whereClause.includes('=')) {
        const eqMatch = whereClause.match(/(\w+)\s*=\s*['"']?([^'"']+)['"']?/i);
        if (eqMatch) {
          const [_, fieldName, value] = eqMatch;
          return String(row[fieldName]).toLowerCase() === value.toLowerCase();
        }
      }
      
      return true;
    });
  }
  
  applyOrderByClause(data: any[], query: string) {
    const orderByMatch = query.match(/order by\s+(\w+)\s*(asc|desc)?/i);
    if (!orderByMatch) return data;
    
    const [_, fieldName, direction] = orderByMatch;
    const isDescending = direction && direction.toLowerCase() === 'desc';
    
    return [...data].sort((a, b) => {
      const valueA = a[fieldName];
      const valueB = b[fieldName];
      
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return isDescending ? valueB - valueA : valueA - valueB;
      }
      
      const strA = String(valueA || '');
      const strB = String(valueB || '');
      
      return isDescending ? strB.localeCompare(strA) : strA.localeCompare(strB);
    });
  }
  
  handleJoinQuery(query: string) {
    if (query.includes('customers') && query.includes('orders')) {
      const results = [];
      
      for (const order of this.tableData.orders) {
        const customer = this.tableData.customers.find(c => c.id === order.customer_id);
        if (customer) {
          results.push({
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
      
      if (query.includes('where') && query.includes('like')) {
        const nameMatch = query.match(/name\s+like\s+['"]%([^%]+)%['"]/i);
        if (nameMatch && nameMatch[1]) {
          const searchName = nameMatch[1].toLowerCase();
          return results.filter(r => r.customer_name.toLowerCase().includes(searchName));
        }
      }
      
      if (query.includes('order by') && query.includes('date')) {
        const isDesc = query.includes('desc');
        results.sort((a, b) => {
          const dateA = new Date(a.order_date);
          const dateB = new Date(b.order_date);
          return isDesc ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
        });
      }
      
      return results;
    }
    
    if (query.includes('products') && query.includes('order_items')) {
      const results: any[] = [];
      const productSales: Record<string, any> = {};
      
      for (const item of this.tableData.order_items) {
        const product = this.tableData.products.find(p => p.id === item.product_id);
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
      
      for (const productName in productSales) {
        results.push(productSales[productName]);
      }
      
      results.sort((a, b) => b.revenue - a.revenue);
      
      return results;
    }
    
    return [];
  }
}

function naturalLanguageToSQL(query: string): string {
  let generatedSQL = `SELECT * FROM customers LIMIT 10`;
  
  for (const pattern of nlPatterns) {
    if (pattern.pattern.test(query.toLowerCase())) {
      generatedSQL = pattern.sqlTemplate(query);
      break;
    }
  }
  
  return generatedSQL;
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

  const dbEngine = new MockDatabaseEngine(mockTableData);
  
  const filteredTables = mockTables.filter(table => 
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
    
    setTimeout(() => {
      try {
        const generatedQuery = naturalLanguageToSQL(naturalLanguageQuery);
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

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-900 rounded-md text-red-300">
                <p className="font-medium mb-1">Error executing query:</p>
                <pre className="text-sm overflow-x-auto">{errorMessage}</pre>
              </div>
            )}

            {queryResults.length > 0 && (
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
