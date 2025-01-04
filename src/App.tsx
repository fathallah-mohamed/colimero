import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Tours from "@/pages/Tours";
import TransporteurDetails from "@/pages/TransporteurDetails";
import Transporteurs from "@/pages/Transporteurs";
import MesReservations from "@/pages/MesReservations";
import MesTournees from "@/pages/MesTournees";
import PlanifierTournee from "@/pages/PlanifierTournee";
import EnvoyerColis from "@/pages/EnvoyerColis";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import APropos from "@/pages/APropos";
import AdminDashboard from "@/pages/AdminDashboard";
import MesDemandesApprobation from "@/pages/MesDemandesApprobation";
import DemandesApprobation from "@/pages/DemandesApprobation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/transporteurs" element={<Transporteurs />} />
            <Route path="/transporteurs/:id" element={<TransporteurDetails />} />
            <Route path="/mes-reservations" element={<MesReservations />} />
            <Route path="/mes-tournees" element={<MesTournees />} />
            <Route path="/planifier-tournee" element={<PlanifierTournee />} />
            <Route path="/envoyer-colis" element={<EnvoyerColis />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/mes-demandes-approbation" element={<MesDemandesApprobation />} />
            <Route path="/demandes-approbation" element={<DemandesApprobation />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;