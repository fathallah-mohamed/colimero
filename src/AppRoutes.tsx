import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import APropos from "./pages/APropos";
import Tours from "./pages/Tours";
import Profile from "./pages/Profile";
import Transporteurs from "./pages/Transporteurs";
import TransporteurDetails from "./pages/TransporteurDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AdminManagement from "./pages/AdminManagement";
import AdminClients from "./pages/AdminClients";
import CarrierSignup from "./pages/CarrierSignup";
import ClientSignup from "./pages/ClientSignup";
import ResetPassword from "./pages/ResetPassword";
import Activation from "./pages/Activation";
import CreateTour from "./pages/CreateTour";
import PlanifierTournee from "./pages/PlanifierTournee";
import MesTournees from "./pages/MesTournees";
import MesReservations from "./pages/MesReservations";
import DemandesApprobation from "./pages/DemandesApprobation";
import MesDemandesApprobation from "./pages/MesDemandesApprobation";
import EnvoyerColis from "./pages/EnvoyerColis";
import Reserver from "./pages/Reserver";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/a-propos" element={<APropos />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/transporteurs" element={<Transporteurs />} />
      <Route path="/transporteur/:id" element={<TransporteurDetails />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/gestion" element={<AdminManagement />} />
      <Route path="/admin/clients" element={<AdminClients />} />
      <Route path="/devenir-transporteur" element={<CarrierSignup />} />
      <Route path="/inscription" element={<ClientSignup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/activation" element={<Activation />} />
      <Route path="/creer-tournee" element={<CreateTour />} />
      <Route path="/planifier-tournee" element={<PlanifierTournee />} />
      <Route path="/mes-tournees" element={<MesTournees />} />
      <Route path="/mes-reservations" element={<MesReservations />} />
      <Route path="/demandes-approbation" element={<DemandesApprobation />} />
      <Route path="/mes-demandes-approbation" element={<MesDemandesApprobation />} />
      <Route path="/envoyer-colis" element={<EnvoyerColis />} />
      <Route path="/reserver/:tourId" element={<Reserver />} />
    </Routes>
  );
}