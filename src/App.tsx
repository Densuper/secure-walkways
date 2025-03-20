
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Index from "./pages/Index";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import UserDashboard from "./pages/UserDashboard";
import QRScan from "./pages/QRScan";
import WalkHistory from "./pages/WalkHistory";
import AdminDashboard from "./pages/AdminDashboard";
import QRManagement from "./pages/QRManagement";
import NotFound from "./pages/NotFound";
import WalkDetails from "./pages/WalkDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/user-login" element={<UserLogin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/qr-scan" element={<QRScan />} />
              <Route path="/qr-scan/:checkpointId" element={<QRScan />} />
              <Route path="/walk-history" element={<WalkHistory />} />
              <Route path="/walk-details/:walkId" element={<WalkDetails />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/qr-management" element={<QRManagement />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
