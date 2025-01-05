import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";
import Index from "./pages/Index";
import Tours from "./pages/Tours";
import Reserver from "./pages/Reserver";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import APropos from "./pages/APropos";
import PlanifierTournee from "./pages/PlanifierTournee";
import EnvoyerColis from "./pages/EnvoyerColis";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import MesTournees from "./pages/MesTournees";
import MesReservations from "./pages/MesReservations";
import DemandesApprobation from "./pages/DemandesApprobation";
import MesDemandesApprobation from "./pages/MesDemandesApprobation";
import Transporteurs from "./pages/Transporteurs";
import TransporteurDetails from "./pages/TransporteurDetails";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/reserver/:tourId" element={<Reserver />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/planifier-tournee" element={<PlanifierTournee />} />
            <Route path="/envoyer-colis" element={<EnvoyerColis />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mes-tournees" element={<MesTournees />} />
            <Route path="/mes-reservations" element={<MesReservations />} />
            <Route path="/demandes-approbation" element={<DemandesApprobation />} />
            <Route path="/mes-demandes-approbation" element={<MesDemandesApprobation />} />
            <Route path="/transporteurs" element={<Transporteurs />} />
            <Route path="/transporteur/:id" element={<TransporteurDetails />} />
          </Routes>
        </div>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;