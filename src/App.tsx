import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Routes, Route } from "react-router-dom";

// Import your pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import APropos from "@/pages/APropos";
import AdminDashboard from "@/pages/AdminDashboard";
import Tours from "@/pages/Tours";
import PlanifierTournee from "@/pages/PlanifierTournee";
import MesTournees from "@/pages/MesTournees";
import EnvoyerColis from "@/pages/EnvoyerColis";
import Transporteurs from "@/pages/Transporteurs";
import TransporteurDetails from "@/pages/TransporteurDetails";
import MesReservations from "@/pages/MesReservations";
import DemandesApprobation from "@/pages/DemandesApprobation";
import MesDemandesApprobation from "@/pages/MesDemandesApprobation";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" attribute="class">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/planifier-tournee" element={<PlanifierTournee />} />
            <Route path="/mes-tournees" element={<MesTournees />} />
            <Route path="/envoyer-colis" element={<EnvoyerColis />} />
            <Route path="/transporteurs" element={<Transporteurs />} />
            <Route path="/transporteur/:id" element={<TransporteurDetails />} />
            <Route path="/mes-reservations" element={<MesReservations />} />
            <Route path="/demandes-approbation" element={<DemandesApprobation />} />
            <Route path="/mes-demandes-approbation" element={<MesDemandesApprobation />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;