import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import APropos from "@/pages/APropos";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import EnvoyerColis from "@/pages/EnvoyerColis";
import PlanifierTournee from "@/pages/PlanifierTournee";
import Profile from "@/pages/Profile";
import ResetPassword from "@/pages/ResetPassword";
import Tours from "@/pages/Tours";
import TransporteurDetails from "@/pages/TransporteurDetails";
import Transporteurs from "@/pages/Transporteurs";
import MesReservations from "@/pages/MesReservations";
import MesTournees from "@/pages/MesTournees";
import DemandesApprobation from "@/pages/DemandesApprobation";
import MesDemandesApprobation from "@/pages/MesDemandesApprobation";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminClients from "@/pages/AdminClients";
import AdminManagement from "@/pages/AdminManagement";
import CreateTour from "@/pages/CreateTour";
import Reserver from "@/pages/Reserver";
import Activation from "@/pages/Activation";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/a-propos" element={<APropos />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/envoyer-colis" element={<EnvoyerColis />} />
      <Route path="/planifier-tournee" element={<PlanifierTournee />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/transporteur/:id" element={<TransporteurDetails />} />
      <Route path="/transporteurs" element={<Transporteurs />} />
      <Route path="/mes-reservations" element={<MesReservations />} />
      <Route path="/mes-tournees" element={<MesTournees />} />
      <Route path="/demandes-approbation" element={<DemandesApprobation />} />
      <Route path="/mes-demandes-approbation" element={<MesDemandesApprobation />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/clients" element={<AdminClients />} />
      <Route path="/admin/gestion" element={<AdminManagement />} />
      <Route path="/transporteur/tournees/creer" element={<CreateTour />} />
      <Route path="/reserver/:tourId" element={<Reserver />} />
      <Route path="/activation" element={<Activation />} />
    </Routes>
  );
}