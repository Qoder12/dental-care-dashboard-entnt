
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
import { PatientProfile } from "./components/PatientProfile";
import { MedicalHistory } from "./components/MedicalHistory";
import { ReportsPage } from "./components/ReportsPage";

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
            <Route path="/incidents" element={<ReportsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </>
        )}
        {user.role === 'Patient' && (
          <>
            <Route path="/profile" element={<PatientProfile />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/medical-history" element={<MedicalHistory />} />
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
