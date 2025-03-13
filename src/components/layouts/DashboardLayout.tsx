
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Database, 
  Workflow, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  User,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard" },
    { path: "/connections", icon: <Database className="h-5 w-5" />, label: "Connections" },
    { path: "/workflows", icon: <Workflow className="h-5 w-5" />, label: "Workflows" },
    { path: "/settings", icon: <Settings className="h-5 w-5" />, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Top Navigation */}
      <header className="bg-gray-800 border-b border-gray-700 py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-gray-300 hover:text-white"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-blue-400" />
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                DataZen Flow
              </span>
            </Link>
          </div>
          
          {/* User dropdown */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex border-blue-500 text-blue-400 hover:bg-blue-950"
              onClick={() => navigate("/workflows/create")}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:inline">{user?.name || "User"}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-gray-300">
                <DropdownMenuItem className="hover:bg-gray-700 hover:text-white cursor-pointer" onClick={() => navigate("/settings")}>
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700 hover:text-white cursor-pointer" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Main Content with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-gray-800 border-r border-gray-700 w-64 flex-shrink-0 flex flex-col transition-all duration-300 
                    md:relative ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} 
                    z-20 absolute inset-y-0 h-[calc(100vh-65px)] mt-[65px] md:mt-0 md:h-auto`}
        >
          <nav className="mt-6 flex-1">
            <ul className="space-y-1 px-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                      location.pathname === item.path
                        ? "bg-blue-900 text-blue-100"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-gray-700 mt-auto">
            <Button 
              variant="secondary" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => navigate("/workflows/create")}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
          </div>
        </aside>
        
        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
