import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  Clock,
  MoreVertical,
  PlayCircle,
  Pause,
  Copy,
  Edit,
  Trash2,
  Database,
  ArrowRight,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Workflow,
} from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { toast } from "sonner";
import { fetchWorkflows, runWorkflow, pauseWorkflow, deleteWorkflow } from '@/lib/api';

// Mock data for workflows
const mockWorkflows = [
  {
    id: 1,
    name: "Sales Data ETL",
    description: "Transform and load daily sales data",
    source: "PostgreSQL",
    destination: "MySQL",
    status: "completed",
    lastRun: "2 hours ago",
    created: "2023-06-15",
    schedule: "Daily at 2:00 AM"
  },
  {
    id: 2,
    name: "User Analytics",
    description: "Extract user activity and generate analytics",
    source: "Supabase",
    destination: "Neon.tech",
    status: "running",
    lastRun: "Running now",
    created: "2023-07-22",
    schedule: "Hourly"
  },
  {
    id: 3,
    name: "Inventory Transform",
    description: "Update inventory levels across systems",
    source: "MySQL",
    destination: "PostgreSQL",
    status: "failed",
    lastRun: "1 day ago",
    created: "2023-08-05",
    schedule: "Every 3 hours"
  },
  {
    id: 4,
    name: "Customer Data Sync",
    description: "Synchronize customer data between platforms",
    source: "Neon.tech",
    destination: "PostgreSQL",
    status: "scheduled",
    lastRun: "1 week ago",
    created: "2023-09-18",
    schedule: "Weekly on Monday"
  },
  {
    id: 5,
    name: "Product Catalog Update",
    description: "Update product details and pricing",
    source: "MySQL",
    destination: "Supabase",
    status: "paused",
    lastRun: "2 weeks ago",
    created: "2023-10-10",
    schedule: "Paused"
  },
];

const Workflows = () => {
  const [workflows, setWorkflows] = useState(mockWorkflows);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch workflows from API
  useEffect(() => {
    const getWorkflows = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWorkflows();
        setWorkflows(data);
      } catch (err) {
        console.error('Failed to fetch workflows:', err);
        setError('Failed to load workflows. Using mock data instead.');
        // Fallback to mock data
        setWorkflows(mockWorkflows);
      } finally {
        setLoading(false);
      }
    };

    getWorkflows();
  }, []);

  // Filter workflows based on search query
  const filteredWorkflows = workflows.filter(
    (workflow) =>
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Action handlers
  const handleRunWorkflow = async (id: number) => {
    try {
      await runWorkflow(id.toString());
      toast.success(`Started workflow #${id}`);
      // Update local state
      setWorkflows(
        workflows.map((w) =>
          w.id === id ? { ...w, status: "running", lastRun: "Running now" } : w
        )
      );
    } catch (err) {
      toast.error(`Failed to start workflow #${id}`);
      console.error(err);
    }
  };

  const handlePauseWorkflow = async (id: number) => {
    try {
      await pauseWorkflow(id.toString());
      toast.success(`Paused workflow #${id}`);
      // Update local state
      setWorkflows(
        workflows.map((w) =>
          w.id === id ? { ...w, status: "paused", schedule: "Paused" } : w
        )
      );
    } catch (err) {
      toast.error(`Failed to pause workflow #${id}`);
      console.error(err);
    }
  };

  const handleDeleteWorkflow = async (id: number) => {
    try {
      await deleteWorkflow(id.toString());
      toast.success(`Deleted workflow #${id}`);
      // Update local state
      setWorkflows(workflows.filter((w) => w.id !== id));
    } catch (err) {
      toast.error(`Failed to delete workflow #${id}`);
      console.error(err);
    }
  };

  const handleDuplicateWorkflow = (id: number) => {
    const workflowToDuplicate = workflows.find((w) => w.id === id);
    if (workflowToDuplicate) {
      const newWorkflow = {
        ...workflowToDuplicate,
        id: Math.max(...workflows.map((w) => w.id)) + 1,
        name: `${workflowToDuplicate.name} (Copy)`,
        status: "scheduled",
        created: new Date().toISOString().split("T")[0],
      };
      setWorkflows([...workflows, newWorkflow]);
      toast.success(`Duplicated workflow "${workflowToDuplicate.name}"`);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let color, icon, text;

    switch (status) {
      case "completed":
        color = "bg-green-900/50 text-green-400";
        icon = <CheckCircle2 className="h-3 w-3 mr-1" />;
        text = "Completed";
        break;
      case "running":
        color = "bg-blue-900/50 text-blue-400";
        icon = <PlayCircle className="h-3 w-3 mr-1" />;
        text = "Running";
        break;
      case "failed":
        color = "bg-red-900/50 text-red-400";
        icon = <XCircle className="h-3 w-3 mr-1" />;
        text = "Failed";
        break;
      case "scheduled":
        color = "bg-purple-900/50 text-purple-400";
        icon = <Clock className="h-3 w-3 mr-1" />;
        text = "Scheduled";
        break;
      case "paused":
        color = "bg-yellow-900/50 text-yellow-400";
        icon = <Pause className="h-3 w-3 mr-1" />;
        text = "Paused";
        break;
      default:
        color = "bg-gray-900/50 text-gray-400";
        icon = <AlertCircle className="h-3 w-3 mr-1" />;
        text = "Unknown";
    }

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${color}`}
      >
        {icon}
        {text}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Workflows</h1>
            <p className="text-gray-400 mt-1">Manage your ETL workflows and transformations</p>
          </div>

          <div className="flex space-x-2">
            <Link to="/nifi-pipeline/root">
              <Button 
                variant="outline" 
                className="border-purple-700 text-purple-400 hover:bg-purple-950"
              >
                <Workflow className="h-4 w-4 mr-2" />
                Manage NiFi Pipeline
              </Button>
            </Link>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate("/workflows/create")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search workflows..."
            className="pl-10 bg-gray-800 border-gray-700 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Workflows Table */}
        <Card className="bg-gray-800 border-gray-700 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-850">
                <TableRow className="border-gray-700 hover:bg-transparent">
                  <TableHead className="text-gray-400 w-[250px]">
                    <div className="flex items-center">
                      Workflow
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-400">Source / Destination</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Schedule</TableHead>
                  <TableHead className="text-gray-400">Last Run</TableHead>
                  <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkflows.length === 0 ? (
                  <TableRow className="border-gray-700">
                    <TableCell colSpan={6} className="text-center py-10 text-gray-400">
                      No workflows found. Try adjusting your search or create a new workflow.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWorkflows.map((workflow) => (
                    <TableRow
                      key={workflow.id}
                      className="border-gray-700 hover:bg-gray-750 cursor-pointer"
                      onClick={() => navigate(`/workflows/${workflow.id}`)}
                    >
                      <TableCell className="font-medium text-white">
                        <div className="flex flex-col">
                          <span>{workflow.name}</span>
                          <span className="text-gray-400 text-xs mt-1">{workflow.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-gray-300">
                          <Database className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{workflow.source}</span>
                          <ArrowRight className="h-3 w-3 mx-2 text-gray-500" />
                          <Database className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{workflow.destination}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={workflow.status} />
                      </TableCell>
                      <TableCell className="text-gray-300">{workflow.schedule}</TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{workflow.lastRun}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-gray-800 border-gray-700 text-gray-300"
                          >
                            <DropdownMenuItem
                              className="hover:bg-gray-700 hover:text-white cursor-pointer"
                              onClick={() => handleRunWorkflow(workflow.id)}
                            >
                              <PlayCircle className="h-4 w-4 mr-2" />
                              <span>Run Now</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="hover:bg-gray-700 hover:text-white cursor-pointer"
                              onClick={() => handlePauseWorkflow(workflow.id)}
                            >
                              <Pause className="h-4 w-4 mr-2" />
                              <span>Pause</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="hover:bg-gray-700 hover:text-white cursor-pointer"
                              onClick={() => navigate(`/workflows/${workflow.id}/edit`)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="hover:bg-gray-700 hover:text-white cursor-pointer"
                              onClick={() => handleDuplicateWorkflow(workflow.id)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              <span>Duplicate</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-400 hover:bg-red-900/50 hover:text-red-300 cursor-pointer"
                              onClick={() => handleDeleteWorkflow(workflow.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Cards - Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-gray-700 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Recent Failures</CardTitle>
                <CardDescription className="text-gray-400">
                  Workflows that need attention
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between items-center text-gray-300">
                  <span>Inventory Transform</span>
                  <span className="text-red-400">1 day ago</span>
                </div>
                <div className="text-xs text-gray-500">
                  Error: Connection timeout to MySQL database
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-700"
                >
                  View Logs
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-gray-800 border-gray-700 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Upcoming Schedule</CardTitle>
                <CardDescription className="text-gray-400">
                  Workflows running soon
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between items-center text-gray-300">
                  <span>Sales Data ETL</span>
                  <span className="text-blue-400">In 2 hours</span>
                </div>
                <div className="flex justify-between items-center text-gray-300">
                  <span>User Analytics</span>
                  <span className="text-blue-400">In 12 minutes</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-700"
                >
                  View Schedule
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-gray-800 border-gray-700 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">System Status</CardTitle>
                <CardDescription className="text-gray-400">
                  Platform health & performance
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between items-center text-gray-300">
                  <span>Worker Nodes</span>
                  <span className="text-green-400">Healthy (3/3)</span>
                </div>
                <div className="flex justify-between items-center text-gray-300">
                  <span>Queue Status</span>
                  <span className="text-gray-300">2 pending</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-700"
                >
                  View Status
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Workflows;
