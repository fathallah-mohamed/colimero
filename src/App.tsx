import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Tours from "./pages/Tours";
import CreateTour from "./pages/CreateTour";
import PlanifierTournee from "./pages/PlanifierTournee";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/profil" element={<Profile />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/planifier-tournee" element={<PlanifierTournee />} />
        <Route path="/transporteur/tournees/creer" element={<CreateTour />} />
      </Routes>
    </Router>
  );
}
