import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { GamificationProvider } from "./contexts/GamificationContext";
import { AIProvider } from "./contexts/AIContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Aprendizagem from "./pages/Aprendizagem";
import BemEstar from "./pages/BemEstar";
import Projetos from "./pages/Projetos";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import Respiracao from "./pages/wellness/Respiracao";
import Alongamento from "./pages/wellness/Alongamento";
import Meditacao from "./pages/wellness/Meditacao";
import Gratidao from "./pages/wellness/Gratidao";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <GamificationProvider>
          <AIProvider>
            <NotificationProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route element={<AppLayout />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/aprendizagem" element={<Aprendizagem />} />
                      <Route path="/bem-estar" element={<BemEstar />} />
                      <Route path="/bem-estar/respiracao" element={<Respiracao />} />
                      <Route path="/bem-estar/alongamento" element={<Alongamento />} />
                      <Route path="/bem-estar/meditacao" element={<Meditacao />} />
                      <Route path="/bem-estar/gratidao" element={<Gratidao />} />
                      <Route path="/projetos" element={<Projetos />} />
                      <Route path="/configuracoes" element={<Configuracoes />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </NotificationProvider>
          </AIProvider>
        </GamificationProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
