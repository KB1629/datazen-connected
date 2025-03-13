
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from 'lucide-react';

interface DataSourceCardProps {
  icon: React.ReactNode;
  name?: string;
  title?: string;
  type?: string;
  host?: string;
  status?: string;
  error?: string;
  updatedAt?: string;
  beta?: boolean;
  onClick?: () => void;
}

const DataSourceCard: React.FC<DataSourceCardProps> = ({ 
  icon, 
  name, 
  title, 
  type, 
  host, 
  status, 
  error, 
  updatedAt, 
  beta, 
  onClick 
}) => {
  // For the existing connections display (detailed card)
  if (title && type) {
    return (
      <Card 
        className={`${
          status === 'Error' ? 'border-red-500/30 bg-red-950/10' : 'bg-gray-800 border-gray-700'
        } hover:border-primary/30 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer p-4`}
        onClick={onClick}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-200 font-medium text-base">{title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">{type}</span>
                  <span className="text-gray-500 text-xs">•</span>
                  <span className="text-xs text-gray-400">{host}</span>
                </div>
              </div>
              {status && (
                <Badge className={status === 'Error' ? 'bg-red-900/30 text-red-300 border-red-800' : 'bg-green-900/30 text-green-300 border-green-800'}>
                  {status}
                </Badge>
              )}
            </div>
            {error && (
              <div className="mt-2 text-xs text-red-400 bg-red-950/30 p-2 rounded border border-red-900/50">
                {error}
              </div>
            )}
            {updatedAt && (
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <Clock size={12} className="mr-1" />
                Last updated {updatedAt}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }
  
  // For data source selection (simple card)
  return (
    <Card 
      className="bg-gray-800 border-gray-700 hover:border-primary/30 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer flex items-center p-4 gap-3"
      onClick={onClick}
    >
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-200">{name || title}</span>
        {beta && <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-800 text-xs">Beta</Badge>}
      </div>
    </Card>
  );
};

export default DataSourceCard;
