import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AccountActivation from "./pages/AccountActivation";
import CarrierSignup from "./pages/CarrierSignup";
import ClientSignup from "./pages/ClientSignup";
import ResetPassword from "./pages/ResetPassword";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/activation-compte" element={<AccountActivation />} />
      <Route path="/devenir-transporteur" element={<CarrierSignup />} />
      <Route path="/creer-compte" element={<ClientSignup />} />
      <Route path="/mot-de-passe-oublie" element={<ResetPassword />} />
      {/* Redirection par défaut vers la page d'accueil */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}