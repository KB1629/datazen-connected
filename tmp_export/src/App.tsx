// Store the token in localStorage if not already present
if (!localStorage.getItem('token')) {
  localStorage.setItem(
    'token',
    'eyJraWQiOiJmY2ZkZjgyMy01NjhjLTQ2MDYtYmU5MC1jY2MwNTkxMDUxOTgiLCJhbGciOiJFZERTQSJ9.eyJzdWIiOiI4NDEyMjgzYS0zZmJkLTQ4OTMtYjk3Ni1mYmFhYThkMzVhOTEiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo4NDQzIiwibmJmIjoxNzQyMzYyMjQyLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo4NDQzIiwiZ3JvdXBzIjpbXSwicHJlZmVycmVkX3VzZXJuYW1lIjoiODQxMjI4M2EtM2ZiZC00ODkzLWI5NzYtZmJhYWE4ZDM1YTkxIiwiZXhwIjoxNzQyMzkxMDQyLCJpYXQiOjE3NDIzNjIyNDIsImp0aSI6ImI4N2E3ZmQzLWJjOTMtNGZiMy1iODY2LWU1YjlkMWQyYjE4MyJ9.Epmufy98w7qc-3Xu9UNA0M1Iqcxq3ZqpJs1d17iW2UrnkX3g1RbBHpq5FpzCjzJ4y2v63cc-0oj6TIYL18e2Aw'
  );
}

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Connections from "./pages/dashboard/Connections";
import Workflows from "./pages/dashboard/Workflows";
import CreateWorkflow from "./pages/dashboard/CreateWorkflow";
import Settings from "./pages/dashboard/Settings";
import Projects from "./pages/dashboard/Projects";
import ProjectSetup from "./pages/dashboard/ProjectSetup";
import SqlExplorer from "./pages/dashboard/SqlExplorer";
import NifiPipeline from "./pages/dashboard/NifiPipeline";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
            <Route path="/workflows" element={<ProtectedRoute><Workflows /></ProtectedRoute>} />
            <Route path="/workflows/create" element={<ProtectedRoute><CreateWorkflow /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/project/setup" element={<ProtectedRoute><ProjectSetup /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/sql-explorer" element={<ProtectedRoute><SqlExplorer /></ProtectedRoute>} />
            <Route path="/nifi-pipeline/:id" element={<ProtectedRoute><NifiPipeline /></ProtectedRoute>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
