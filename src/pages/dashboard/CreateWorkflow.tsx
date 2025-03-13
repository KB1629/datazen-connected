
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';

const CreateWorkflow = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Workflow</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">
            Design your ETL workflow by dragging and dropping components from the sidebar onto the canvas.
          </p>
          
          <div className="bg-gray-100 border border-dashed border-gray-300 rounded-lg p-6 min-h-[400px] flex items-center justify-center">
            <p className="text-gray-500 text-center">
              Workflow canvas will be implemented here.<br />
              Drag and drop components to build your workflow.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateWorkflow;
