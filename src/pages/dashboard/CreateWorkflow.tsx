
import React, { useState, useCallback, useRef } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Database, 
  Code, 
  LayoutPanelLeft, 
  Table, 
  ArrowRight, 
  Save, 
  Trash2, 
  PlayCircle,
  HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Panel, 
  MarkerType,
  Position,
  Connection,
  Node,
  NodeProps,
  Edge,
  NodeTypes
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Node data type interfaces
interface DatabaseSourceData {
  label: string;
  connectionType: string;
  host: string;
  tables?: string[];
  [key: string]: unknown;
}

interface TransformData {
  label: string;
  query: string;
  [key: string]: unknown;
}

interface DestinationData {
  label: string;
  connectionType: string;
  destination: string;
  tableName?: string;
  [key: string]: unknown;
}

// Custom node components
const DatabaseSourceNode: React.FC<NodeProps<DatabaseSourceData>> = ({ data }) => {
  return (
    <div className="flex flex-col bg-blue-950 text-white p-4 rounded-lg min-w-[200px] border border-blue-400">
      <div className="flex items-center mb-2">
        <Database className="h-5 w-5 mr-2 text-blue-400" />
        <span className="font-bold">{data.label}</span>
      </div>
      <div className="text-xs text-blue-300 mb-2">{data.connectionType}</div>
      <div className="text-xs text-gray-300">
        <div className="mb-1">Host: {data.host}</div>
        <div>Tables: {data.tables?.length || 0}</div>
      </div>
    </div>
  );
};

const TransformNode: React.FC<NodeProps<TransformData>> = ({ data }) => {
  return (
    <div className="flex flex-col bg-purple-950 text-white p-4 rounded-lg min-w-[200px] border border-purple-400">
      <div className="flex items-center mb-2">
        <Code className="h-5 w-5 mr-2 text-purple-400" />
        <span className="font-bold">{data.label}</span>
      </div>
      <div className="text-xs text-purple-300 mb-2">SQL Transformation</div>
      <div className="text-xs bg-purple-900/50 p-2 rounded text-gray-300 font-mono">
        {data.query || 'SELECT * FROM table'}
      </div>
    </div>
  );
};

const DestinationNode: React.FC<NodeProps<DestinationData>> = ({ data }) => {
  return (
    <div className="flex flex-col bg-green-950 text-white p-4 rounded-lg min-w-[200px] border border-green-400">
      <div className="flex items-center mb-2">
        <Table className="h-5 w-5 mr-2 text-green-400" />
        <span className="font-bold">{data.label}</span>
      </div>
      <div className="text-xs text-green-300 mb-2">{data.connectionType}</div>
      <div className="text-xs text-gray-300">
        <div className="mb-1">Destination: {data.destination}</div>
        <div>Table: {data.tableName || 'new_table'}</div>
      </div>
    </div>
  );
};

// Node types mapping
const nodeTypes: NodeTypes = {
  databaseSource: DatabaseSourceNode,
  transform: TransformNode,
  destination: DestinationNode
};

const CreateWorkflow = () => {
  const [workflowName, setWorkflowName] = useState('New Workflow');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodeDragging, setNodeDragging] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const nodeIdCounter = useRef(1);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep',
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      style: { stroke: '#9370DB', strokeWidth: 2 }
    }, eds));
  }, [setEdges]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      
      if (typeof type === 'undefined' || !type) {
        return;
      }

      if (!reactFlowWrapper.current) return;

      const position = reactFlowWrapper.current.getBoundingClientRect();
      const x = event.clientX - position.left;
      const y = event.clientY - position.top;
      
      if (type === 'databaseSource') {
        const newNode: Node<DatabaseSourceData> = {
          id: `${type}_${nodeIdCounter.current++}`,
          type,
          position: { x, y },
          data: { 
            label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodeIdCounter.current}`,
            connectionType: 'PostgreSQL',
            host: 'db.neon.tech',
            tables: ['users', 'products']
          },
          targetPosition: Position.Left,
          sourcePosition: Position.Right,
        };
        setNodes((nds) => nds.concat(newNode));
      } else if (type === 'transform') {
        const newNode: Node<TransformData> = {
          id: `${type}_${nodeIdCounter.current++}`,
          type,
          position: { x, y },
          data: { 
            label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodeIdCounter.current}`,
            query: 'SELECT * FROM users WHERE status = "active"'
          },
          targetPosition: Position.Left,
          sourcePosition: Position.Right,
        };
        setNodes((nds) => nds.concat(newNode));
      } else if (type === 'destination') {
        const newNode: Node<DestinationData> = {
          id: `${type}_${nodeIdCounter.current++}`,
          type,
          position: { x, y },
          data: { 
            label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodeIdCounter.current}`,
            connectionType: 'MySQL',
            destination: 'analytics_db',
            tableName: 'active_users'
          },
          targetPosition: Position.Left,
        };
        setNodes((nds) => nds.concat(newNode));
      }
    },
    [setNodes]
  );
  
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
    setNodeDragging(true);
  };

  const onDragEnd = () => {
    setNodeDragging(false);
  };

  const saveWorkflow = () => {
    toast.success(`Workflow "${workflowName}" saved successfully`);
  };

  const runWorkflow = () => {
    if (nodes.length === 0) {
      toast.error('No nodes in workflow to run');
      return;
    }
    toast.success('Workflow started running');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              <Input 
                value={workflowName} 
                onChange={(e) => setWorkflowName(e.target.value)}
                className="bg-transparent border-none text-white text-2xl font-bold p-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-80"
              />
            </h1>
            <p className="text-gray-400">Create your ETL workflow by dragging nodes onto the canvas.</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="border-gray-700 text-gray-300 hover:bg-gray-700"
              onClick={saveWorkflow}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Workflow
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={runWorkflow}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Run Workflow
            </Button>
          </div>
        </div>
        
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0 animate-fade-in">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium text-white mb-4">Components</h3>
                
                <div className="space-y-3">
                  <div
                    className={`p-3 bg-blue-900/40 rounded-lg border border-blue-700 cursor-move flex items-center hover:bg-blue-900/60 transition-colors duration-200 ${nodeDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    draggable
                    onDragStart={(e) => onDragStart(e, 'databaseSource')}
                    onDragEnd={onDragEnd}
                  >
                    <Database className="h-5 w-5 text-blue-400 mr-2" />
                    <span className="text-white">Database Source</span>
                  </div>
                  
                  <div
                    className={`p-3 bg-purple-900/40 rounded-lg border border-purple-700 cursor-move flex items-center hover:bg-purple-900/60 transition-colors duration-200 ${nodeDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    draggable
                    onDragStart={(e) => onDragStart(e, 'transform')}
                    onDragEnd={onDragEnd}
                  >
                    <Code className="h-5 w-5 text-purple-400 mr-2" />
                    <span className="text-white">SQL Transform</span>
                  </div>
                  
                  <div
                    className={`p-3 bg-green-900/40 rounded-lg border border-green-700 cursor-move flex items-center hover:bg-green-900/60 transition-colors duration-200 ${nodeDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    draggable
                    onDragStart={(e) => onDragStart(e, 'destination')}
                    onDragEnd={onDragEnd}
                  >
                    <Table className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-white">Destination</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-white mb-2">Instructions</h3>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span>Drag components onto the canvas</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span>Connect nodes by dragging from outputs to inputs</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span>Click on nodes to edit properties</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            {selectedNodeId && (
              <Card className="bg-gray-800 border-gray-700 mt-4 animate-scale-in">
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center justify-between">
                    <span>Node Properties</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-gray-400 hover:text-red-400 hover:bg-gray-700"
                      onClick={() => {
                        setNodes(nodes.filter(n => n.id !== selectedNodeId));
                        setSelectedNodeId(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </h3>
                  
                  <div className="space-y-3">
                    {nodes.find(n => n.id === selectedNodeId)?.type === 'databaseSource' && (
                      <>
                        <div className="space-y-1">
                          <Label className="text-gray-300">Source Name</Label>
                          <Input 
                            className="bg-gray-700 border-gray-600 text-white"
                            value={nodes.find(n => n.id === selectedNodeId)?.data?.label || ''}
                            onChange={(e) => {
                              setNodes(nodes.map(n => {
                                if (n.id === selectedNodeId) {
                                  return { ...n, data: { ...n.data, label: e.target.value } };
                                }
                                return n;
                              }));
                            }}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-gray-300">Connection Type</Label>
                          <Input 
                            className="bg-gray-700 border-gray-600 text-white"
                            value={nodes.find(n => n.id === selectedNodeId)?.data?.connectionType || ''}
                            onChange={(e) => {
                              setNodes(nodes.map(n => {
                                if (n.id === selectedNodeId) {
                                  return { ...n, data: { ...n.data, connectionType: e.target.value } };
                                }
                                return n;
                              }));
                            }}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-gray-300">Host</Label>
                          <Input 
                            className="bg-gray-700 border-gray-600 text-white"
                            value={nodes.find(n => n.id === selectedNodeId)?.data?.host || ''}
                            onChange={(e) => {
                              setNodes(nodes.map(n => {
                                if (n.id === selectedNodeId) {
                                  return { ...n, data: { ...n.data, host: e.target.value } };
                                }
                                return n;
                              }));
                            }}
                          />
                        </div>
                      </>
                    )}
                    
                    {nodes.find(n => n.id === selectedNodeId)?.type === 'transform' && (
                      <>
                        <div className="space-y-1">
                          <Label className="text-gray-300">Transform Name</Label>
                          <Input 
                            className="bg-gray-700 border-gray-600 text-white"
                            value={nodes.find(n => n.id === selectedNodeId)?.data?.label || ''}
                            onChange={(e) => {
                              setNodes(nodes.map(n => {
                                if (n.id === selectedNodeId) {
                                  return { ...n, data: { ...n.data, label: e.target.value } };
                                }
                                return n;
                              }));
                            }}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-gray-300">SQL Query</Label>
                          <textarea 
                            className="w-full h-20 bg-gray-700 border-gray-600 text-white rounded-md p-2 text-sm font-mono"
                            value={nodes.find(n => n.id === selectedNodeId)?.data?.query || ''}
                            onChange={(e) => {
                              setNodes(nodes.map(n => {
                                if (n.id === selectedNodeId) {
                                  return { ...n, data: { ...n.data, query: e.target.value } };
                                }
                                return n;
                              }));
                            }}
                          />
                        </div>
                        
                        <Button 
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={() => toast.success("AI generated query applied")}
                        >
                          Generate SQL with AI
                        </Button>
                      </>
                    )}
                    
                    {nodes.find(n => n.id === selectedNodeId)?.type === 'destination' && (
                      <>
                        <div className="space-y-1">
                          <Label className="text-gray-300">Destination Name</Label>
                          <Input 
                            className="bg-gray-700 border-gray-600 text-white"
                            value={nodes.find(n => n.id === selectedNodeId)?.data?.label || ''}
                            onChange={(e) => {
                              setNodes(nodes.map(n => {
                                if (n.id === selectedNodeId) {
                                  return { ...n, data: { ...n.data, label: e.target.value } };
                                }
                                return n;
                              }));
                            }}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-gray-300">Connection Type</Label>
                          <Input 
                            className="bg-gray-700 border-gray-600 text-white"
                            value={nodes.find(n => n.id === selectedNodeId)?.data?.connectionType || ''}
                            onChange={(e) => {
                              setNodes(nodes.map(n => {
                                if (n.id === selectedNodeId) {
                                  return { ...n, data: { ...n.data, connectionType: e.target.value } };
                                }
                                return n;
                              }));
                            }}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-gray-300">Database</Label>
                          <Input 
                            className="bg-gray-700 border-gray-600 text-white"
                            value={nodes.find(n => n.id === selectedNodeId)?.data?.destination || ''}
                            onChange={(e) => {
                              setNodes(nodes.map(n => {
                                if (n.id === selectedNodeId) {
                                  return { ...n, data: { ...n.data, destination: e.target.value } };
                                }
                                return n;
                              }));
                            }}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-gray-300">Table Name</Label>
                          <Input 
                            className="bg-gray-700 border-gray-600 text-white"
                            value={nodes.find(n => n.id === selectedNodeId)?.data?.tableName || ''}
                            onChange={(e) => {
                              setNodes(nodes.map(n => {
                                if (n.id === selectedNodeId) {
                                  return { ...n, data: { ...n.data, tableName: e.target.value } };
                                }
                                return n;
                              }));
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Canvas */}
          <div className="flex-1 bg-gray-850 border border-gray-700 rounded-lg overflow-hidden" 
            style={{ height: 'calc(100vh - 210px)', minHeight: '500px' }}
            ref={reactFlowWrapper}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-right"
              className="bg-gray-900"
            >
              <Background color="#444" gap={16} />
              <Controls />
              <MiniMap 
                nodeColor={(node) => {
                  switch (node.type) {
                    case 'databaseSource':
                      return '#1e40af';
                    case 'transform':
                      return '#6b21a8';
                    case 'destination':
                      return '#166534';
                    default:
                      return '#222';
                  }
                }}
                maskColor="rgba(0, 0, 0, 0.5)"
                className="bg-gray-800"
              />
              
              <Panel position="top-left" className="ml-4 mt-4">
                <div className="flex items-center bg-gray-800 rounded p-2 shadow-md">
                  <Badge className="bg-blue-600 text-white">Beta</Badge>
                  <span className="ml-2 text-white text-sm">Workflow Editor</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                    onClick={() => toast.info("Help center coming soon!")}
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </div>
              </Panel>
            </ReactFlow>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateWorkflow;
