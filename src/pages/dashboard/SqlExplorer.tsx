
import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft, PlayCircle, Download, Table, FileCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import DatabaseBrowser from '@/components/etl/DatabaseBrowser';

// Mock database tables for demonstration
const mockTables = [
  { name: 'customers', rowCount: 1243 },
  { name: 'orders', rowCount: 5210 },
  { name: 'products', rowCount: 487 },
  { name: 'order_items', rowCount: 18652 },
  { name: 'employees', rowCount: 42 },
];

// Mock data for query results
const mockQueryResults = [
  { id: 1, name: 'John Doe', email: 'john@example.com', orders: 5, total_spent: 529.95 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 3, total_spent: 129.85 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', orders: 12, total_spent: 1045.20 },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', orders: 8, total_spent: 839.50 },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', orders: 1, total_spent: 49.99 },
];

const SqlExplorer = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM customers WHERE total_spent > 100 ORDER BY total_spent DESC');
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState<string>('');
  const [generatedSql, setGeneratedSql] = useState<string>('');
  const [queryResults, setQueryResults] = useState<any[]>(mockQueryResults);
  const [activeTab, setActiveTab] = useState('sql');

  const handleSelectTable = (tableName: string) => {
    setSelectedTable(tableName);
    setSqlQuery(`SELECT * FROM ${tableName} LIMIT 100`);
  };

  const handleRunQuery = () => {
    console.log('Running query:', sqlQuery);
    // In a real app, this would make an API call to run the query
    // For now, we'll just use our mock data
    setQueryResults(mockQueryResults);
  };

  const handleGenerateSql = () => {
    if (!naturalLanguageQuery) return;
    
    // Simulate generating SQL from natural language
    setTimeout(() => {
      const sample = `SELECT c.name, c.email, COUNT(o.id) as order_count, SUM(o.total) as total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.id
HAVING SUM(o.total) > 100
ORDER BY total_spent DESC`;
      
      setGeneratedSql(sample);
      setSqlQuery(sample);
    }, 500);
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
              <Table size={18} />
              Database Tables
            </h2>
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tables..."
                className="pl-8 bg-sidebar-accent border-sidebar-border text-white"
              />
            </div>
            <div className="space-y-2 mt-4">
              {mockTables.map((table) => (
                <div
                  key={table.name}
                  onClick={() => handleSelectTable(table.name)}
                  className={`p-2.5 rounded-md cursor-pointer flex justify-between items-center ${
                    selectedTable === table.name
                      ? 'bg-primary/20 text-primary'
                      : 'text-gray-300 hover:bg-sidebar-accent'
                  }`}
                >
                  <span>{table.name}</span>
                  <span className="text-xs text-gray-500">{table.rowCount.toLocaleString()} rows</span>
                </div>
              ))}
            </div>
          </div>

          {/* Query editor */}
          <div className="md:col-span-2 bg-sidebar-background border border-sidebar-border rounded-lg p-4">
            <Tabs defaultValue="sql" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="mb-4 bg-sidebar-accent">
                <TabsTrigger value="sql">SQL Query</TabsTrigger>
                <TabsTrigger value="nl">Natural Language</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sql" className="space-y-4">
                <textarea
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
                  <Button onClick={handleRunQuery} className="bg-primary hover:bg-primary/90">
                    <PlayCircle size={16} className="mr-2" />
                    Run Query
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="nl" className="space-y-4">
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Ask a question about your data in plain English..."
                    className="bg-sidebar-accent border-sidebar-border text-white"
                    value={naturalLanguageQuery}
                    onChange={(e) => setNaturalLanguageQuery(e.target.value)}
                  />
                  <Button 
                    onClick={handleGenerateSql} 
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <FileCode size={16} className="mr-2" />
                    Generate SQL
                  </Button>
                  
                  {generatedSql && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Generated SQL:</h3>
                      <div className="bg-sidebar-accent p-3 rounded-md border border-sidebar-border font-mono text-sm text-white overflow-x-auto">
                        <pre>{generatedSql}</pre>
                      </div>
                      <Button 
                        onClick={handleRunQuery} 
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
            <div className="mt-6">
              <h3 className="text-lg font-medium text-white mb-4">Query Results</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-sidebar-accent text-gray-300 text-left">
                      {queryResults.length > 0 && Object.keys(queryResults[0]).map((key) => (
                        <th key={key} className="p-2 border-b border-sidebar-border">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResults.map((row, i) => (
                      <tr key={i} className="text-gray-300 hover:bg-sidebar-accent/50">
                        {Object.values(row).map((value, j) => (
                          <td key={j} className="p-2 border-b border-sidebar-border">
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SqlExplorer;
