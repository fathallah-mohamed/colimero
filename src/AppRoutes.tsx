import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AccountActivation from "./pages/AccountActivation";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/activation-compte" element={<AccountActivation />} />
    </Routes>
  );
}
