import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import APropos from "@/pages/APropos";
import Profile from "@/pages/Profile";
import Tours from "@/pages/Tours";
import Transporteurs from "@/pages/Transporteurs";
import TransporteurDetails from "@/pages/TransporteurDetails";
import EnvoyerColis from "@/pages/EnvoyerColis";
import PlanifierTournee from "@/pages/PlanifierTournee";
import MesTournees from "@/pages/MesTournees";
import MesReservations from "@/pages/MesReservations";
import MesDemandesApprobation from "@/pages/MesDemandesApprobation";
import DemandesApprobation from "@/pages/DemandesApprobation";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminClients from "@/pages/AdminClients";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/a-propos" element={<APropos />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/transporteurs" element={<Transporteurs />} />
              <Route path="/transporteur/:id" element={<TransporteurDetails />} />
              <Route path="/envoyer-colis" element={<EnvoyerColis />} />
              <Route path="/planifier-tournee" element={<PlanifierTournee />} />
              <Route path="/mes-tournees" element={<MesTournees />} />
              <Route path="/mes-reservations" element={<MesReservations />} />
              <Route path="/mes-demandes-approbation" element={<MesDemandesApprobation />} />
              <Route path="/admin/demandes-approbation" element={<DemandesApprobation />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/clients" element={<AdminClients />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
