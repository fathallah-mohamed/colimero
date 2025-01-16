import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import CarrierSignup from "./pages/CarrierSignup";
import ClientSignup from "./pages/ClientSignup";
import Profile from "./pages/Profile";
import Tours from "./pages/Tours";
import CreateTour from "./pages/CreateTour";
import MesTournees from "./pages/MesTournees";
import MesReservations from "./pages/MesReservations";
import MesDemandesApprobation from "./pages/MesDemandesApprobation";
import DemandesApprobation from "./pages/DemandesApprobation";
import AdminDashboard from "./pages/AdminDashboard";
import AdminManagement from "./pages/AdminManagement";
import AdminClients from "./pages/AdminClients";
import PlanifierTournee from "./pages/PlanifierTournee";
import EnvoyerColis from "./pages/EnvoyerColis";
import Reserver from "./pages/Reserver";
import Transporteurs from "./pages/Transporteurs";
import TransporteurDetails from "./pages/TransporteurDetails";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import APropos from "./pages/APropos";
import ResetPassword from "./pages/ResetPassword";
import Activation from "./pages/Activation";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/inscription-transporteur" element={<CarrierSignup />} />
      <Route path="/inscription-client" element={<ClientSignup />} />
      <Route path="/profil" element={<Profile />} />
      <Route path="/tournees" element={<Tours />} />
      <Route path="/creer-une-tournee" element={<CreateTour />} />
      <Route path="/mes-tournees" element={<MesTournees />} />
      <Route path="/mes-reservations" element={<MesReservations />} />
      <Route path="/mes-demandes-approbation" element={<MesDemandesApprobation />} />
      <Route path="/demandes-approbation" element={<DemandesApprobation />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/gestion" element={<AdminManagement />} />
      <Route path="/admin/clients" element={<AdminClients />} />
      <Route path="/planifier-une-tournee" element={<PlanifierTournee />} />
      <Route path="/envoyer-un-colis" element={<EnvoyerColis />} />
      <Route path="/reserver" element={<Reserver />} />
      <Route path="/transporteurs" element={<Transporteurs />} />
      <Route path="/transporteurs/:id" element={<TransporteurDetails />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/a-propos" element={<APropos />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/activation" element={<Activation />} />
    </Routes>
  );
}