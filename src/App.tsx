
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { PatientsPage } from "./components/PatientsPage";
import { AppointmentsPage } from "./components/AppointmentsPage";
import { CalendarView } from "./components/CalendarView";
import { MyAppointments } from "./components/MyAppointments";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {user.role === 'Admin' && (
          <>
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/incidents" element={<div>Incidents Page - Coming Soon</div>} />
            <Route path="/reports" element={<div>Reports Page - Coming Soon</div>} />
          </>
        )}
        {user.role === 'Patient' && (
          <>
            <Route path="/profile" element={<div>Profile Page - Coming Soon</div>} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/medical-history" element={<div>Medical History - Coming Soon</div>} />
          </>
        )}
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
