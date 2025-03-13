
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft, PlayCircle, Download, FileCode, Database, Copy, Info, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockTables, mockTableSchemas, mockTableData } from '@/lib/sqlMockData';
import { SQLQueryEngine } from '@/lib/sqlQueryEngine';
import { convertNaturalLanguageToSQL } from '@/lib/naturalLanguageConverter';

const SqlExplorer = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM customers LIMIT 100');
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState<string>('');
  const [generatedSql, setGeneratedSql] = useState<string>('');
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('sql');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isGeneratingSql, setIsGeneratingSql] = useState(false);
  const [tableSchema, setTableSchema] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultCount, setResultCount] = useState<number>(0);

  const dbEngine = new SQLQueryEngine(mockTableData);
  
  const filteredTables = mockTables.filter(table => 
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  useEffect(() => {
    if (selectedTable) {
      const table = mockTables.find(t => t.name === selectedTable);
      if (table) {
        setTableSchema(mockTableSchemas[selectedTable as keyof typeof mockTableSchemas] || []);
        setSqlQuery(`SELECT * FROM ${selectedTable} LIMIT 100`);
        
        try {
          const results = dbEngine.executeQuery(`SELECT * FROM ${selectedTable} LIMIT 100`);
          setQueryResults(results.data);
          setResultCount(results.count);
          setErrorMessage(null);
        } catch (error) {
          console.error('Error executing query:', error);
          setErrorMessage(String(error));
          setQueryResults([]);
          setResultCount(0);
        }
      }
    }
  }, [selectedTable]);

  const handleSelectTable = (tableName: string) => {
    setSelectedTable(tableName);
  };

  const handleRunQuery = () => {
    if (!sqlQuery.trim()) {
      toast.error("Please enter a SQL query");
      return;
    }
    
    setIsExecuting(true);
    setErrorMessage(null);
    
    console.log('Running query:', sqlQuery);
    
    setTimeout(() => {
      try {
        const results = dbEngine.executeQuery(sqlQuery);
        setQueryResults(results.data);
        setResultCount(results.count);
        toast.success('Query executed successfully');
      } catch (error) {
        console.error('Error executing query:', error);
        setErrorMessage(String(error));
        setQueryResults([]);
        setResultCount(0);
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
    
    setIsGeneratingSql(true);
    setErrorMessage(null);
    
    setTimeout(() => {
      try {
        const generatedQuery = convertNaturalLanguageToSQL(naturalLanguageQuery, selectedTable);
        setGeneratedSql(generatedQuery);
        setSqlQuery(generatedQuery);
        toast.success('SQL generated successfully');
      } catch (error) {
        console.error('Error generating SQL:', error);
        setErrorMessage(String(error));
        toast.error('Error generating SQL');
      } finally {
        setIsGeneratingSql(false);
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
                    <div key={column.column} className="flex justify-between text-gray-300 py-1 border-b border-gray-800">
                      <span className="flex items-center">
                        {column.column}
                        {column.primary && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="ml-1 text-yellow-400">
                                  <Info size={12} />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Primary Key</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </span>
                      <span className="text-gray-500">{column.type}</span>
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
                    {isExecuting ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <PlayCircle size={16} className="mr-2" />
                        Run Query
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="nl" className="space-y-4">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Ask a question about your data in plain English... (e.g., 'Show customers with name starting with J')"
                    className="bg-sidebar-accent border-sidebar-border text-white h-24"
                    value={naturalLanguageQuery}
                    onChange={(e) => setNaturalLanguageQuery(e.target.value)}
                  />
                  <Button 
                    onClick={handleGenerateSql} 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isGeneratingSql}
                  >
                    {isGeneratingSql ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileCode size={16} className="mr-2" />
                        Generate SQL
                      </>
                    )}
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
                  <span className="text-sm text-gray-400">{resultCount} rows (showing {queryResults.length})</span>
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
