import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import APropos from "./pages/APropos";
import Tours from "./pages/Tours";
import Transporteurs from "./pages/Transporteurs";
import TransporteurDetails from "./pages/TransporteurDetails";
import PlanifierTournee from "./pages/PlanifierTournee";
import CreateTourForm from "./components/tour/CreateTourForm";
import EnvoyerColis from "./pages/EnvoyerColis";
import AdminDashboard from "./pages/AdminDashboard";
import AdminManagement from "./pages/AdminManagement";
import AdminClients from "./pages/AdminClients";
import DemandesApprobation from "./pages/DemandesApprobation";
import MesDemandesApprobation from "./pages/MesDemandesApprobation";
import MesTournees from "./pages/MesTournees";
import MesReservations from "./pages/MesReservations";
import Reserver from "./pages/Reserver";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/transporteurs" element={<Transporteurs />} />
          <Route path="/transporteurs/:id" element={<TransporteurDetails />} />
          <Route path="/planifier-tournee" element={<PlanifierTournee />} />
          <Route path="/transporteur/tournees/creer" element={<CreateTourForm onSuccess={() => {}} />} />
          <Route path="/envoyer-colis" element={<EnvoyerColis />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/gestion" element={<AdminManagement />} />
          <Route path="/admin/clients" element={<AdminClients />} />
          <Route path="/demandes-approbation" element={<DemandesApprobation />} />
          <Route path="/mes-demandes-approbation" element={<MesDemandesApprobation />} />
          <Route path="/mes-tournees" element={<MesTournees />} />
          <Route path="/mes-reservations" element={<MesReservations />} />
          <Route path="/reserver/:tourId" element={<Reserver />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;