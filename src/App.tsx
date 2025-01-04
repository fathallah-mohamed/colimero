import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Index from "@/pages/Index";
import Profile from "@/pages/Profile";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminClients from "@/pages/AdminClients";
import Tours from "@/pages/Tours";
import TransporteurDetails from "@/pages/TransporteurDetails";
import Transporteurs from "@/pages/Transporteurs";
import MesReservations from "@/pages/MesReservations";
import MesTournees from "@/pages/MesTournees";
import DemandesApprobation from "@/pages/DemandesApprobation";
import MesDemandesApprobation from "@/pages/MesDemandesApprobation";
import PlanifierTournee from "@/pages/PlanifierTournee";
import EnvoyerColis from "@/pages/EnvoyerColis";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import APropos from "@/pages/APropos";

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
              <Route path="/profil" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/clients" element={<AdminClients />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/transporteur/:id" element={<TransporteurDetails />} />
              <Route path="/transporteurs" element={<Transporteurs />} />
              <Route path="/mes-reservations" element={<MesReservations />} />
              <Route path="/mes-tournees" element={<MesTournees />} />
              <Route path="/demandes-approbation" element={<DemandesApprobation />} />
              <Route path="/mes-demandes-approbation" element={<MesDemandesApprobation />} />
              <Route path="/planifier-tournee" element={<PlanifierTournee />} />
              <Route path="/envoyer-colis" element={<EnvoyerColis />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/a-propos" element={<APropos />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;