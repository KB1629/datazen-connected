
import { useState, useEffect } from "react";
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
  ChevronDown,
  Sparkles,
  FolderKanban,
  FileCode,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen
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
  /** Flag to indicate if the sidebar should be shown */
  showSidebar?: boolean;
  /** Optional back navigation link */
  backLink?: string;
  /** Optional back navigation text */
  backText?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  showSidebar = true,
  backLink,
  backText 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard" },
    { path: "/projects", icon: <FolderKanban className="h-5 w-5" />, label: "Projects" },
    { path: "/connections", icon: <Database className="h-5 w-5" />, label: "Connections" },
    { path: "/workflows", icon: <Workflow className="h-5 w-5" />, label: "Workflows" },
    { path: "/sql-explorer", icon: <FileCode className="h-5 w-5" />, label: "SQL Explorer" },
    { path: "/settings", icon: <Settings className="h-5 w-5" />, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="bg-sidebar-background border-b border-sidebar-border py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showSidebar && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-sidebar-foreground hover:text-white"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
            
            {backLink ? (
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  className="mr-2 text-sidebar-foreground hover:text-white"
                  onClick={() => navigate(backLink)}
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  {backText || 'Back'}
                </Button>
              </div>
            ) : (
              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="bg-primary rounded-md p-1.5">
                  <Database className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl text-white">
                  DataZen <span className="text-primary">Flow</span>
                </span>
              </Link>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
              onClick={() => navigate("/project/setup")}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New Project
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
                >
                  <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden md:inline">{user?.name || "User"}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground">
                <DropdownMenuItem className="hover:bg-sidebar-background hover:text-white cursor-pointer" onClick={() => navigate("/settings")}>
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-sidebar-background hover:text-white cursor-pointer" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <>
            <aside
              className={`bg-sidebar-background border-r border-sidebar-border flex-shrink-0 flex flex-col transition-all duration-300 
                        md:relative ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} 
                        z-20 absolute inset-y-0 h-[calc(100vh-65px)] mt-[65px] md:mt-0 md:h-auto
                        ${sidebarCollapsed ? "md:w-20" : "md:w-64"} relative`}
            >
              <nav className="mt-6 flex-1">
                <ul className="space-y-1 px-4">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                          location.pathname === item.path
                            ? "bg-primary/20 text-primary"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
                        }`}
                      >
                        {item.icon}
                        {!sidebarCollapsed && <span>{item.label}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              
              {/* Toggle button positioned at the right border */}
              <div className="absolute right-0 top-60 z-30">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-5 rounded-l-md rounded-r-none border border-r-0 border-sidebar-border bg-sidebar-background text-sidebar-foreground opacity-30 hover:opacity-100 hover:text-white hover:bg-sidebar-accent transition-opacity"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {sidebarCollapsed ? 
                    <PanelLeftOpen className="h-4 w-4" /> : 
                    <PanelLeftClose className="h-4 w-4" />
                  }
                </Button>
              </div>
              
              {!sidebarCollapsed && (
                <div className="p-4 border-t border-sidebar-border mt-auto">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    onClick={() => navigate("/project/setup")}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </div>
              )}
            </aside>
            
            {sidebarOpen && (
              <div 
                className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </>
        )}
        
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
