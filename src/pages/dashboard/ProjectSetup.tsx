
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Search } from 'lucide-react';
import DataSourceCard from '@/components/etl/DataSourceCard';
import { sampleDatasets, dataBoilerplates, externalDataSources } from '@/data/dataSources';

const ProjectSetup = () => {
  const navigate = useNavigate();

  const handleSelectSource = (id: string, type: string) => {
    toast.success(`Selected ${type}: ${id}`);
    navigate('/workflows/create');
  };

  return (
    <DashboardLayout>
      <div className="container max-w-5xl py-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-white mb-2">Setup your project</h1>
        <p className="text-gray-400 mb-10">Choose a data source to start building your ETL workflow</p>

        {/* Sample Dataset Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-3">Start with a sample dataset</h2>
          <p className="text-gray-400 mb-6">
            At DataZen Flow, we offer sample datasets for a quick hands-on experience. Choose one to quickly start gaining insights.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sampleDatasets.map(dataset => (
              <DataSourceCard
                key={dataset.id}
                icon={dataset.icon}
                name={dataset.name}
                onClick={() => handleSelectSource(dataset.id, 'sample dataset')}
              />
            ))}
          </div>
        </div>

        {/* Data Boilerplate Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-3">Start with a data boilerplate</h2>
          <p className="text-gray-400 mb-6">
            We offer boilerplates with clearly defined semantics. Choose one to quickly start gaining insights.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {dataBoilerplates.map(boilerplate => (
              <DataSourceCard
                key={boilerplate.id}
                icon={boilerplate.icon}
                name={boilerplate.name}
                beta={boilerplate.beta}
                onClick={() => handleSelectSource(boilerplate.id, 'data boilerplate')}
              />
            ))}
          </div>
          
          <div className="mt-3">
            <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto">
              Learn more about data boilerplates
            </Button>
          </div>
        </div>

        {/* External Data Source Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-3">Connect an external data source</h2>
          <p className="text-gray-400 mb-6">
            Connect to your own databases or data warehouses.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {externalDataSources.map(source => (
              <DataSourceCard
                key={source.id}
                icon={source.icon}
                name={source.name}
                onClick={() => handleSelectSource(source.id, 'external data source')}
              />
            ))}
          </div>
          
          <div className="mt-3">
            <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto">
              Contact us to suggest new data sources
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectSetup;
