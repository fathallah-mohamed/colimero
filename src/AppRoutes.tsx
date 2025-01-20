import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Tours from "@/pages/Tours";
import TourDetails from "@/pages/TourDetails";
import MesDemandesApprobation from "@/pages/MesDemandesApprobation";
import EnvoyerColis from "@/pages/EnvoyerColis";
import PlanifierTournee from "@/pages/PlanifierTournee";
import Transporteurs from "@/pages/Transporteurs";
import TransporteurDetails from "@/pages/TransporteurDetails";
import CreateTour from "@/pages/CreateTour";
import { useSessionInitializer } from "@/components/navigation/SessionInitializer";

export default function AppRoutes() {
  // Initialize session here, where we have access to router context
  useSessionInitializer();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/mes-demandes-approbation" element={<MesDemandesApprobation />} />
      <Route path="/envoyer-colis" element={<EnvoyerColis />} />
      <Route path="/planifier-tournee" element={<PlanifierTournee />} />
      <Route path="/transporteurs" element={<Transporteurs />} />
      <Route path="/transporteurs/:id" element={<TransporteurDetails />} />
      <Route path="/transporteur/tournees/creer" element={<CreateTour />} />
    </Routes>
  );
}