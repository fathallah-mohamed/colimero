import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PlanifierTournee from "./pages/PlanifierTournee";
import EnvoyerColis from "./pages/EnvoyerColis";
import Transporteurs from "./pages/Transporteurs";
import TransporteurDetails from "./pages/TransporteurDetails";
import Tours from "./pages/Tours";
import Blog from "./pages/Blog";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/planifier-une-tournee" element={<PlanifierTournee />} />
          <Route path="/envoyer-un-colis" element={<EnvoyerColis />} />
          <Route path="/nos-transporteurs" element={<Transporteurs />} />
          <Route path="/transporteur/:id" element={<TransporteurDetails />} />
          <Route path="/tournees" element={<Tours />} />
          <Route path="/actualites" element={<Blog />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/nous-contacter" element={<Contact />} />
          <Route path="/connexion" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;