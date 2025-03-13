
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from 'lucide-react';

interface DataSourceCardProps {
  icon: React.ReactNode;
  name: string;
  beta?: boolean;
  onClick: () => void;
}

const DataSourceCard: React.FC<DataSourceCardProps> = ({ icon, name, beta, onClick }) => {
  return (
    <Card 
      className="bg-gray-800 border-gray-700 hover:border-primary/30 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer flex items-center p-4 gap-3"
      onClick={onClick}
    >
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-200">{name}</span>
        {beta && <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-800 text-xs">Beta</Badge>}
      </div>
    </Card>
  );
};

export default DataSourceCard;
