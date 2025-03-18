import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, Play, Square, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  getNifiPipeline,
  getNifiPipelineStatus,
  startNifiPipeline,
  stopNifiPipeline,
  testNiFiConnection
} from '@/lib/api';

const NifiPipeline = () => {
  const { id = 'root' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pipeline, setPipeline] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch pipeline data
  useEffect(() => {
    const fetchPipeline = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First test connection to NiFi
        const connectionTest = await testNiFiConnection();
        if (!connectionTest.success) {
          setError('Failed to connect to NiFi server. Please check if the server is running and accessible.');
          setLoading(false);
          return;
        }
        
        // Then fetch pipeline details
        const data = await getNifiPipeline(id);
        setPipeline(data);
        
        // Fetch status immediately after getting pipeline
        const statusData = await getNifiPipelineStatus(id);
        setStatus(statusData);
        
      } catch (err) {
        console.error('Error fetching pipeline:', err);
        setError('Failed to load pipeline data. Please check if the NiFi server is running and accessible.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPipeline();
  }, [id]);
  
  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    
    try {
      // Refresh pipeline status
      const statusData = await getNifiPipelineStatus(id);
      setStatus(statusData);
      toast.success('Pipeline status refreshed');
    } catch (err) {
      console.error('Error refreshing pipeline status:', err);
      toast.error('Failed to refresh pipeline status');
    } finally {
      setRefreshing(false);
    }
  };
  
  // Handle start pipeline
  const handleStartPipeline = async () => {
    try {
      await startNifiPipeline(id);
      toast.success('Pipeline started successfully');
      handleRefresh();
    } catch (err) {
      console.error('Error starting pipeline:', err);
      toast.error('Failed to start pipeline');
    }
  };
  
  // Handle stop pipeline
  const handleStopPipeline = async () => {
    try {
      await stopNifiPipeline(id);
      toast.success('Pipeline stopped successfully');
      handleRefresh();
    } catch (err) {
      console.error('Error stopping pipeline:', err);
      toast.error('Failed to stop pipeline');
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-white">
              {loading ? 'Loading Pipeline...' : pipeline?.processGroup?.component?.name || 'NiFi Pipeline'}
            </h1>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={loading || refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            {status && status.status === 'RUNNING' ? (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleStopPipeline}
                disabled={loading}
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Pipeline
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="sm"
                onClick={handleStartPipeline}
                disabled={loading}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Pipeline
              </Button>
            )}
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Pipeline</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-400">Loading pipeline details...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          !error && (
            <div className="grid grid-cols-1 gap-6">
              {/* Pipeline Details */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Pipeline Details</h2>
                  {pipeline && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">ID</h3>
                          <p className="text-white font-mono text-sm bg-gray-700 p-2 rounded">{pipeline.processGroup?.id || id}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Status</h3>
                          <div className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
                            status?.status === 'RUNNING' 
                              ? 'bg-green-900/50 text-green-400' 
                              : 'bg-yellow-900/50 text-yellow-400'
                          }`}>
                            {status?.status || 'Unknown'}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Description</h3>
                        <p className="text-white">
                          {pipeline.processGroup?.component?.comments || 'No description available'}
                        </p>
                      </div>
                      
                      {/* If we have processor states, show them */}
                      {status?.processorStates && status.processorStates.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-2">Processors</h3>
                          <div className="border border-gray-700 rounded-md overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-700">
                              <thead className="bg-gray-900">
                                <tr>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Name
                                  </th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Type
                                  </th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    State
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {status.processorStates.map((processor: any) => (
                                  <tr key={processor.id}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                                      {processor.name}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                      {processor.type.split('.').pop()}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        processor.state === 'RUNNING' 
                                          ? 'bg-green-900/50 text-green-400' 
                                          : processor.state === 'STOPPED' 
                                            ? 'bg-yellow-900/50 text-yellow-400'
                                            : 'bg-gray-900/50 text-gray-400'
                                      }`}>
                                        {processor.state}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Future: Add more cards for metrics, logs, etc. */}
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  );
};

export default NifiPipeline; 