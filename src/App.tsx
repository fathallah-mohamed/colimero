import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminManagement from "./pages/AdminManagement";
import AdminClients from "./pages/AdminClients";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import APropos from "./pages/APropos";
import Tours from "./pages/Tours";
import PlanifierTournee from "./pages/PlanifierTournee";
import MesTournees from "./pages/MesTournees";
import Transporteurs from "./pages/Transporteurs";
import TransporteurDetails from "./pages/TransporteurDetails";
import DemandesApprobation from "./pages/DemandesApprobation";
import MesDemandesApprobation from "./pages/MesDemandesApprobation";
import MesReservations from "./pages/MesReservations";
import Reserver from "./pages/Reserver";
import EnvoyerColis from "./pages/EnvoyerColis";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/gestion" element={<AdminManagement />} />
          <Route path="/admin/clients" element={<AdminClients />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/planifier-tournee" element={<PlanifierTournee />} />
          <Route path="/mes-tournees" element={<MesTournees />} />
          <Route path="/transporteurs" element={<Transporteurs />} />
          <Route path="/transporteur/:id" element={<TransporteurDetails />} />
          <Route path="/demandes-approbation" element={<DemandesApprobation />} />
          <Route path="/mes-demandes-approbation" element={<MesDemandesApprobation />} />
          <Route path="/mes-reservations" element={<MesReservations />} />
          <Route path="/reserver/:tourId" element={<Reserver />} />
          <Route path="/envoyer-colis" element={<EnvoyerColis />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;