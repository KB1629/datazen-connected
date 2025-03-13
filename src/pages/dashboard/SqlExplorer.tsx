
import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft } from 'lucide-react';
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

const SqlExplorer = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const handleSelectTable = (tableName: string) => {
    setSelectedTable(tableName);
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

        <DatabaseBrowser tables={mockTables} onSelectTable={handleSelectTable} />
      </div>
    </DashboardLayout>
  );
};

export default SqlExplorer;
