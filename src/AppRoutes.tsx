import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import ClientSignup from "@/pages/ClientSignup";
import CarrierSignup from "@/pages/CarrierSignup";
import Profile from "@/pages/Profile";
import ResetPassword from "@/pages/ResetPassword";
import SetupPassword from "@/pages/SetupPassword";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/creer-compte" element={<ClientSignup />} />
      <Route path="/devenir-transporteur" element={<CarrierSignup />} />
      <Route path="/profil" element={<Profile />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/setup-password" element={<SetupPassword />} />
    </Routes>
  );
}
