import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Tours from "@/pages/Tours";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import APropos from "@/pages/APropos";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import PlanifierTournee from "@/pages/PlanifierTournee";
import MesTournees from "@/pages/MesTournees";
import MesReservations from "@/pages/MesReservations";
import Transporteurs from "@/pages/Transporteurs";
import TransporteurDetails from "@/pages/TransporteurDetails";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminClients from "@/pages/AdminClients";
import AdminManagement from "@/pages/AdminManagement";
import DemandesApprobation from "@/pages/DemandesApprobation";
import MesDemandesApprobation from "@/pages/MesDemandesApprobation";
import EnvoyerColis from "@/pages/EnvoyerColis";
import Reserver from "@/pages/Reserver";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/planifier-tournee" element={<PlanifierTournee />} />
        <Route path="/mes-tournees" element={<MesTournees />} />
        <Route path="/mes-reservations" element={<MesReservations />} />
        <Route path="/transporteurs" element={<Transporteurs />} />
        <Route path="/transporteurs/:id" element={<TransporteurDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/clients" element={<AdminClients />} />
        <Route path="/admin/gestion" element={<AdminManagement />} />
        <Route path="/demandes-approbation" element={<DemandesApprobation />} />
        <Route path="/mes-demandes-approbation" element={<MesDemandesApprobation />} />
        <Route path="/envoyer-colis" element={<EnvoyerColis />} />
        <Route path="/reserver" element={<Reserver />} />
      </Routes>
    </Router>
  );
}

export default App;