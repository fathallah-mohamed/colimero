import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import MesTournees from "@/pages/MesTournees";
import MesReservations from "@/pages/MesReservations";
import PlanifierTournee from "@/pages/PlanifierTournee";
import Tours from "@/pages/Tours";
import Reserver from "@/pages/Reserver";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import APropos from "@/pages/APropos";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminClients from "@/pages/AdminClients";
import AdminManagement from "@/pages/AdminManagement";
import DemandesApprobation from "@/pages/DemandesApprobation";
import MesDemandesApprobation from "@/pages/MesDemandesApprobation";
import Transporteurs from "@/pages/Transporteurs";
import TransporteurDetails from "@/pages/TransporteurDetails";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/mes-tournees" element={<MesTournees />} />
          <Route path="/mes-reservations" element={<MesReservations />} />
          <Route path="/planifier-une-tournee" element={<PlanifierTournee />} />
          <Route path="/tournees" element={<Tours />} />
          <Route path="/reserver/:tourId" element={<Reserver />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/clients" element={<AdminClients />} />
          <Route path="/admin/gestion" element={<AdminManagement />} />
          <Route path="/demandes-approbation" element={<DemandesApprobation />} />
          <Route path="/mes-demandes-approbation" element={<MesDemandesApprobation />} />
          <Route path="/nos-transporteurs" element={<Transporteurs />} />
          <Route path="/transporteur/:id" element={<TransporteurDetails />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;