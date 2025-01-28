import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AccountActivation from "./pages/AccountActivation";
import CarrierSignup from "./pages/CarrierSignup";
import ClientSignup from "./pages/ClientSignup";
import ResetPassword from "./pages/ResetPassword";
import PlanifierTournee from "./pages/PlanifierTournee";
import EnvoyerColis from "./pages/EnvoyerColis";
import Transporteurs from "./pages/Transporteurs";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/activation-compte" element={<AccountActivation />} />
      <Route path="/devenir-transporteur" element={<CarrierSignup />} />
      <Route path="/creer-compte" element={<ClientSignup />} />
      <Route path="/mot-de-passe-oublie" element={<ResetPassword />} />
      <Route path="/planifier-tournee" element={<PlanifierTournee />} />
      <Route path="/envoyer-colis" element={<EnvoyerColis />} />
      <Route path="/transporteurs" element={<Transporteurs />} />
      <Route path="/a-propos" element={<APropos />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}