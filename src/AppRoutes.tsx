import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Tours from "@/pages/Tours";
import TourDetails from "@/pages/TourDetails";
import MesDemandesApprobation from "@/pages/MesDemandesApprobation";
import EnvoyerColis from "@/pages/EnvoyerColis";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/mes-demandes-approbation" element={<MesDemandesApprobation />} />
      <Route path="/envoyer-colis" element={<EnvoyerColis />} />
    </Routes>
  );
}