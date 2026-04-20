import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnalysisProvider } from "@/context/AnalysisContext";
import Index from "./pages/Index";
import Analyze from "./pages/Analyze";
import Dashboard from "./pages/Dashboard";
import Incidents from "./pages/Incidents";
import Logs from "./pages/Logs";
import Chaos from "./pages/Chaos";
import Architecture from "./pages/Architecture";
import DevOps from "./pages/DevOps";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AnalysisProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/chaos" element={<Chaos />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="/devops" element={<DevOps />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AnalysisProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
