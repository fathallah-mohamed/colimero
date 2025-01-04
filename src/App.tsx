import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Tours from "@/pages/Tours";
import TransporteurDetails from "@/pages/TransporteurDetails";
import Transporteurs from "@/pages/Transporteurs";
import AdminDashboard from "@/pages/AdminDashboard";
import Profile from "@/pages/Profile";
import MesTournees from "@/pages/MesTournees";
import MesReservations from "@/pages/MesReservations";
import DemandesApprobation from "@/pages/DemandesApprobation";
import MesDemandesApprobation from "@/pages/MesDemandesApprobation";
import PlanifierTournee from "@/pages/PlanifierTournee";
import EnvoyerColis from "@/pages/EnvoyerColis";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import APropos from "@/pages/APropos";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/transporteurs" element={<Transporteurs />} />
        <Route path="/transporteurs/:id" element={<TransporteurDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profil" element={<Profile />} />
        <Route path="/mes-tournees" element={<MesTournees />} />
        <Route path="/mes-reservations" element={<MesReservations />} />
        <Route path="/demandes-approbation" element={<DemandesApprobation />} />
        <Route path="/mes-demandes-approbation" element={<MesDemandesApprobation />} />
        <Route path="/planifier-tournee" element={<PlanifierTournee />} />
        <Route path="/envoyer-colis" element={<EnvoyerColis />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/a-propos" element={<APropos />} />
      </Routes>
    </Router>
  );
}

export default App;