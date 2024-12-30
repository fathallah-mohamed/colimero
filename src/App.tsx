import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PlanifierTournee from "./pages/PlanifierTournee";
import EnvoyerColis from "./pages/EnvoyerColis";
import Transporteurs from "./pages/Transporteurs";
import TransporteurDetails from "./pages/TransporteurDetails";
import Tours from "./pages/Tours";
import Blog from "./pages/Blog";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import MesTournees from "./pages/MesTournees";
import MesReservations from "./pages/MesReservations";
import DemandesApprobation from "./pages/DemandesApprobation";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/planifier-une-tournee" element={<PlanifierTournee />} />
          <Route path="/envoyer-un-colis" element={<EnvoyerColis />} />
          <Route path="/nos-transporteurs" element={<Transporteurs />} />
          <Route path="/nos-transporteurs/:id" element={<TransporteurDetails />} />
          <Route path="/tournees" element={<Tours />} />
          <Route path="/actualites" element={<Blog />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/nous-contacter" element={<Contact />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/mes-tournees" element={<MesTournees />} />
          <Route path="/mes-reservations" element={<MesReservations />} />
          <Route path="/demandes-approbation" element={<DemandesApprobation />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;