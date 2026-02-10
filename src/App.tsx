import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AIAssistantPage from "./pages/AIAssistantPage";
import SpaceDetail from "./pages/SpaceDetail";
import SearchPage from "./pages/SearchPage";
import GetQuotePage from "./pages/GetQuotePage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSpaces from "./pages/admin/AdminSpaces";
import AdminAddSpace from "./pages/admin/AdminAddSpace";
import AdminEditSpace from "./pages/admin/AdminEditSpace";
import AdminQuotes from "./pages/admin/AdminQuotes";
import AdminBrochures from "./pages/admin/AdminBrochures";
import AdminLogin from "./pages/admin/AdminLogin";
import ImageUploadExample from "./pages/ImageUploadExample";
import SimpleUploadExample from "./pages/SimpleUploadExample";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import { AIFloatingButton } from "./components/AIFloatingButton";

const queryClient = new QueryClient();

const GOOGLE_CLIENT_ID = "377779076570-a0b1cd4d4f59veo9m2c403qjb7i349qn.apps.googleusercontent.com";

const App = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Home Page */}
              <Route path="/" element={<Index />} />
              <Route path="/ai-assistant" element={<AIAssistantPage />} />

              {/* Search Results Page */}
              <Route path="/search" element={<SearchPage />} />

              {/* Image Upload Test Pages */}
              <Route path="/test-upload" element={<ImageUploadExample />} />
              <Route path="/test-upload-simple" element={<SimpleUploadExample />} />

              {/* Auth Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Dashboard Page */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Space Detail Page */}
              <Route path="/space/:id" element={<SpaceDetail />} />
              <Route path="/quote/:id" element={<GetQuotePage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="requests" element={<AdminRequests />} />
                <Route path="quotes" element={<AdminQuotes />} />
                <Route path="brochures" element={<AdminBrochures />} />
                <Route path="spaces" element={<AdminSpaces />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="add-space" element={<AdminAddSpace />} />
                <Route path="edit-space/:id" element={<AdminEditSpace />} />
              </Route>

              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <AIFloatingButton />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);

export default App;