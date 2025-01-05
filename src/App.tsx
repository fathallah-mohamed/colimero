import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Tours from "./pages/Tours";
import Transporteurs from "./pages/Transporteurs";
import TransporteurDetails from "./pages/TransporteurDetails";
import PlanifierTournee from "./pages/PlanifierTournee";
import EnvoyerColis from "./pages/EnvoyerColis";
import MesTournees from "./pages/MesTournees";
import MesReservations from "./pages/MesReservations";
import DemandesApprobation from "./pages/DemandesApprobation";
import MesDemandesApprobation from "./pages/MesDemandesApprobation";
import AdminDashboard from "./pages/AdminDashboard";
import AdminClients from "./pages/AdminClients";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/profil" element={<Profile />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/transporteurs" element={<Transporteurs />} />
        <Route path="/transporteurs/:id" element={<TransporteurDetails />} />
        <Route path="/planifier-tournee" element={<PlanifierTournee />} />
        <Route path="/envoyer-colis" element={<EnvoyerColis />} />
        <Route path="/mes-tournees" element={<MesTournees />} />
        <Route path="/mes-reservations" element={<MesReservations />} />
        <Route path="/demandes-approbation" element={<DemandesApprobation />} />
        <Route path="/mes-demandes-approbation" element={<MesDemandesApprobation />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/clients" element={<AdminClients />} />
      </Routes>
    </Router>
  );
}

export default App;