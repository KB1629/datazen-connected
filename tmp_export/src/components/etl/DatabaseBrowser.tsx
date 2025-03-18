
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Search, Database, MessageSquare, Code, Table as TableIcon, LineChart, Loader2, LayoutList, LayoutGrid, Copy } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SQLQueryEngine } from "@/lib/sqlQueryEngine";
import { convertNaturalLanguageToSQL } from "@/lib/naturalLanguageConverter";
import { mockTableData } from "@/lib/sqlMockData";

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
  const [resultCount, setResultCount] = useState<number>(0);

  const dbEngine = new SQLQueryEngine(mockTableData);

  const filteredTables = tables.filter(table => 
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRunQuery = () => {
    if (!queryInput.trim()) {
      toast.error("Please enter a SQL query");
      return;
    }
    
    setIsRunningQuery(true);
    
    setTimeout(() => {
      try {
        const result = dbEngine.executeQuery(queryInput);
        setResults(result.data);
        setResultCount(result.count);
        toast.success("Query executed successfully");
      } catch (error) {
        console.error('Error executing query:', error);
        toast.error(`Error executing query: ${error}`);
        setResults([]);
      } finally {
        setIsRunningQuery(false);
      }
    }, 800);
  };

  const handleNaturalLanguageQuery = () => {
    if (!queryInput.trim()) {
      toast.error("Please enter a question about your data");
      return;
    }
    
    setIsGeneratingSQL(true);
    
    // Generate SQL from natural language query
    setTimeout(() => {
      try {
        const sql = convertNaturalLanguageToSQL(queryInput, selectedTableName);
        setGeneratedSQL(sql);
        setIsGeneratingSQL(false);
        toast.success("SQL generated successfully");
      
        // After generating SQL, simulate running it
        setIsRunningQuery(true);
        
        setTimeout(() => {
          try {
            const result = dbEngine.executeQuery(sql);
            setResults(result.data);
            setResultCount(result.count);
            toast.success("Query executed successfully");
          } catch (error) {
            console.error('Error executing query:', error);
            toast.error(`Error executing query: ${error}`);
            setResults([]);
          } finally {
            setIsRunningQuery(false);
          }
        }, 800);
      } catch (error) {
        console.error('Error generating SQL:', error);
        toast.error(`Error generating SQL: ${error}`);
        setIsGeneratingSQL(false);
      }
    }, 800);
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

  const handleTableSelect = (tableName: string) => {
    setSelectedTableName(tableName);
    onSelectTable(tableName);
    
    // Load data for the selected table
    setIsRunningQuery(true);
    
    setTimeout(() => {
      try {
        const result = dbEngine.executeQuery(`SELECT * FROM ${tableName} LIMIT 100`);
        setResults(result.data);
        setResultCount(result.count);
        toast.success(`Showing data from table: ${tableName}`);
      } catch (error) {
        console.error('Error loading table data:', error);
        toast.error(`Error loading table data: ${error}`);
        setResults([]);
      } finally {
        setIsRunningQuery(false);
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
                      disabled={isGeneratingSQL || isRunningQuery}
                    >
                      {isGeneratingSQL ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : isRunningQuery ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Running...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </div>
                  
                  {generatedSQL && (
                    <div className="mt-4 p-4 rounded-md border border-gray-700 bg-gray-900/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-300">Generated SQL Query:</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-gray-400 hover:text-white"
                          onClick={() => copyToClipboard(generatedSQL)}
                        >
                          <Copy size={14} />
                        </Button>
                      </div>
                      <pre className="bg-gray-900 p-3 rounded text-green-400 overflow-x-auto text-sm">
                        {generatedSQL}
                      </pre>
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
              
              {results && results.length > 0 && (
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
                    <span className="text-sm text-gray-400">{resultCount} rows (showing {results.length})</span>
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
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DatabaseBrowser;
