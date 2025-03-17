import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Server,
  BarChart,
  FileText,
  Settings,
  Info,
  Upload,
  Download,
  XCircle,
  ChevronRight,
  ExternalLink,
  StopCircle,
  ArrowRightLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  getNifiPipeline, 
  getNifiPipelineStatus, 
  startNifiPipeline, 
  stopNifiPipeline, 
  getNifiPipelineMetrics 
} from '@/lib/api';

interface PipelineStatus {
  status: string;
  processorStates: {
    id: string;
    name: string;
    state: string;
    type: string;
  }[];
  lastUpdated: string;
}

interface PipelineMetrics {
  bytesIn: number;
  bytesOut: number;
  bytesQueued: number;
  flowFilesIn: number;
  flowFilesOut: number;
  flowFilesQueued: number;
  activeThreadCount: number;
  lastRefreshed: string;
}

const NifiPipeline = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pipeline, setPipeline] = useState<any>(null);
  const [status, setStatus] = useState<PipelineStatus | null>(null);
  const [metrics, setMetrics] = useState<PipelineMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Load pipeline data
  useEffect(() => {
    const fetchPipelineData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Load pipeline details, status, and metrics in parallel
        const [pipelineData, statusData, metricsData] = await Promise.all([
          getNifiPipeline(id),
          getNifiPipelineStatus(id),
          getNifiPipelineMetrics(id)
        ]);
        
        setPipeline(pipelineData);
        setStatus(statusData);
        setMetrics(metricsData);
      } catch (err) {
        console.error('Error loading pipeline data:', err);
        setError('Failed to load pipeline data. Please check if the NiFi server is running and accessible.');
        toast.error('Failed to load pipeline data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPipelineData();
    
    // Refresh status and metrics every 30 seconds
    const intervalId = setInterval(() => {
      refreshPipelineData();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [id]);
  
  // Function to refresh pipeline data
  const refreshPipelineData = async () => {
    if (!id) return;
    
    setRefreshing(true);
    
    try {
      const [statusData, metricsData] = await Promise.all([
        getNifiPipelineStatus(id),
        getNifiPipelineMetrics(id)
      ]);
      
      setStatus(statusData);
      setMetrics(metricsData);
      setError(null);
    } catch (err) {
      console.error('Error refreshing pipeline data:', err);
      setError('Failed to refresh pipeline data');
      toast.error('Failed to refresh pipeline data');
    } finally {
      setRefreshing(false);
    }
  };
  
  // Start the pipeline
  const handleStartPipeline = async () => {
    if (!id) return;
    
    try {
      await startNifiPipeline(id);
      toast.success('Pipeline started successfully');
      
      // Refresh status after a short delay
      setTimeout(() => refreshPipelineData(), 1000);
    } catch (err) {
      console.error('Error starting pipeline:', err);
      toast.error('Failed to start pipeline');
    }
  };
  
  // Stop the pipeline
  const handleStopPipeline = async () => {
    if (!id) return;
    
    try {
      await stopNifiPipeline(id);
      toast.success('Pipeline stopped successfully');
      
      // Refresh status after a short delay
      setTimeout(() => refreshPipelineData(), 1000);
    } catch (err) {
      console.error('Error stopping pipeline:', err);
      toast.error('Failed to stop pipeline');
    }
  };
  
  // Format bytes to a human-readable format
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Render status badge
  const StatusBadge = ({ status }: { status: string }) => {
    let color = '';
    switch (status) {
      case 'RUNNING':
        color = 'bg-green-900/50 text-green-400';
        break;
      case 'STOPPED':
        color = 'bg-yellow-900/50 text-yellow-400';
        break;
      case 'DISABLED':
        color = 'bg-gray-900/50 text-gray-400';
        break;
      default:
        color = 'bg-blue-900/50 text-blue-400';
    }
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${color}`}
      >
        {status}
      </span>
    );
  };
  
  // Open NiFi UI with this pipeline
  const openInNiFiUI = () => {
    if (!pipeline?.id) return;
    
    // Construct the NiFi UI URL based on the API URL
    // This assumes that the NiFi UI is running on the same host as the API
    const nifiUrl = process.env.NIFI_API_URL || 'https://localhost:8443/nifi';
    alert(nifiUrl);
    const processGroupUrl = `${nifiUrl}/?processGroupId=${pipeline.id}`;
    window.open(processGroupUrl, '_blank');
  };
  
  // Show loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="container p-4 mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
              <p className="text-white">Loading pipeline data...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="container p-4 mx-auto">
          <Card className="bg-red-900/20 border-red-800">
            <CardContent className="p-6">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-red-400 mr-4 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Error Loading Pipeline</h3>
                  <p className="text-red-300 mb-4">{error}</p>
                  <Button 
                    onClick={() => window.location.reload()}
                    className="bg-red-700 hover:bg-red-800 text-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }
  
  // Get the pipeline name from the data
  const pipelineName = pipeline?.component?.name || 'NiFi Pipeline';
  
  return (
    <DashboardLayout>
      <div className="container p-4 mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{pipelineName}</h1>
            <p className="text-gray-400">
              Pipeline ID: {id}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {status?.status === 'RUNNING' ? (
              <Button 
                onClick={handleStopPipeline}
                className="bg-yellow-700 hover:bg-yellow-800 text-white"
              >
                <PauseCircle className="h-4 w-4 mr-2" />
                Stop Pipeline
              </Button>
            ) : (
              <Button 
                onClick={handleStartPipeline}
                className="bg-green-700 hover:bg-green-800 text-white"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Start Pipeline
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="border-gray-700 text-gray-300 hover:bg-gray-700"
              onClick={refreshPipelineData}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button 
              variant="outline" 
              className="border-gray-700 text-gray-300 hover:bg-gray-700"
              onClick={openInNiFiUI}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in NiFi
            </Button>
          </div>
        </div>
        
        {/* Status Card */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-900/40 text-blue-400 mr-4">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Pipeline Status</h3>
                  <div className="flex items-center mt-1">
                    <StatusBadge status={status?.status || 'UNKNOWN'} />
                    <span className="text-gray-400 text-sm ml-4">
                      Last Updated: {status?.lastUpdated ? new Date(status.lastUpdated).toLocaleTimeString() : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{metrics?.flowFilesIn || 0}</div>
                  <div className="text-xs text-gray-400">Flow Files In</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{metrics?.flowFilesOut || 0}</div>
                  <div className="text-xs text-gray-400">Flow Files Out</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{metrics?.bytesIn ? formatBytes(metrics.bytesIn) : '0 B'}</div>
                  <div className="text-xs text-gray-400">Bytes In</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{metrics?.bytesOut ? formatBytes(metrics.bytesOut) : '0 B'}</div>
                  <div className="text-xs text-gray-400">Bytes Out</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="processors" className="data-[state=active]:bg-gray-700">
              Processors
            </TabsTrigger>
            <TabsTrigger value="metrics" className="data-[state=active]:bg-gray-700">
              Metrics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Pipeline Overview</CardTitle>
                <CardDescription className="text-gray-400">
                  General information about this NiFi pipeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Pipeline Details</h3>
                    <dl className="space-y-4">
                      <div className="flex flex-col">
                        <dt className="text-gray-400 text-sm">Pipeline Name</dt>
                        <dd className="text-white font-medium">{pipelineName}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-gray-400 text-sm">Pipeline ID</dt>
                        <dd className="text-white font-mono text-sm">{id}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-gray-400 text-sm">Status</dt>
                        <dd><StatusBadge status={status?.status || 'UNKNOWN'} /></dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-gray-400 text-sm">Active Threads</dt>
                        <dd className="text-white font-medium">{metrics?.activeThreadCount || 0}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Processing Statistics</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-900/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Upload className="h-4 w-4 text-blue-400 mr-2" />
                            <span className="text-gray-300">Data In</span>
                          </div>
                          <span className="text-white font-medium">{metrics?.bytesIn ? formatBytes(metrics.bytesIn) : '0 B'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Flow Files</span>
                          <span className="text-gray-300">{metrics?.flowFilesIn || 0}</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-900/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Download className="h-4 w-4 text-green-400 mr-2" />
                            <span className="text-gray-300">Data Out</span>
                          </div>
                          <span className="text-white font-medium">{metrics?.bytesOut ? formatBytes(metrics.bytesOut) : '0 B'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Flow Files</span>
                          <span className="text-gray-300">{metrics?.flowFilesOut || 0}</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-900/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-yellow-400 mr-2" />
                            <span className="text-gray-300">Queued</span>
                          </div>
                          <span className="text-white font-medium">{metrics?.bytesQueued ? formatBytes(metrics.bytesQueued) : '0 B'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Flow Files</span>
                          <span className="text-gray-300">{metrics?.flowFilesQueued || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="processors" className="mt-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Processors</CardTitle>
                <CardDescription className="text-gray-400">
                  All processors in this pipeline and their current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {status?.processorStates?.length > 0 ? (
                    status.processorStates.map((processor: any) => (
                      <div key={processor.id} className="bg-gray-900/50 rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div className="flex items-center">
                            <div className={`h-3 w-3 rounded-full mr-3 ${
                              processor.state === 'RUNNING' ? 'bg-green-500' :
                              processor.state === 'STOPPED' ? 'bg-yellow-500' :
                              'bg-gray-500'
                            }`} />
                            <div>
                              <h4 className="text-white font-medium">{processor.name}</h4>
                              <p className="text-gray-400 text-sm">{processor.type.split('.').pop()}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <StatusBadge status={processor.state} />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="ml-2 text-gray-400 hover:text-white"
                              onClick={openInNiFiUI}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Info className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No processors found in this pipeline</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="metrics" className="mt-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Pipeline Metrics</CardTitle>
                <CardDescription className="text-gray-400">
                  Detailed metrics for this pipeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gray-850 border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white">Input</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Flow Files</span>
                          <span className="text-white font-medium">{metrics?.flowFilesIn || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Bytes</span>
                          <span className="text-white font-medium">{metrics?.bytesIn ? formatBytes(metrics.bytesIn) : '0 B'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-850 border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white">Output</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Flow Files</span>
                          <span className="text-white font-medium">{metrics?.flowFilesOut || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Bytes</span>
                          <span className="text-white font-medium">{metrics?.bytesOut ? formatBytes(metrics.bytesOut) : '0 B'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-850 border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white">Queued</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Flow Files</span>
                          <span className="text-white font-medium">{metrics?.flowFilesQueued || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Bytes</span>
                          <span className="text-white font-medium">{metrics?.bytesQueued ? formatBytes(metrics.bytesQueued) : '0 B'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default NifiPipeline; 