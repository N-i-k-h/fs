import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SpaceDetail from "./pages/SpaceDetail";
import SearchPage from "./pages/SearchPage";
// import Dashboard from "./pages/Dashboard"; // <--- 1. IMPORT DASHBOARD HERE
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Index />} />
          
          {/* Search Results Page */}
          <Route path="/search" element={<SearchPage />} />

          {/* Dashboard Page */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> <--- 2. ADD ROUTE HERE */}
          
          {/* Space Detail Page */}
          <Route path="/space/:id" element={<SpaceDetail />} />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;