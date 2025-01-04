import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/Navigation";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import Profile from "@/pages/Profile";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminCarriers from "@/pages/AdminCarriers";
import AdminClients from "@/pages/AdminClients";
import Carriers from "@/pages/Carriers";
import CarrierProfile from "@/pages/CarrierProfile";
import CarrierDashboard from "@/pages/CarrierDashboard";
import CarrierApprovalRequests from "@/pages/CarrierApprovalRequests";
import ClientReservations from "@/pages/ClientReservations";
import ClientApprovalRequests from "@/pages/ClientApprovalRequests";
import PlanDelivery from "@/pages/PlanDelivery";
import SendPackage from "@/pages/SendPackage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/a-propos" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/profil" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/transporteurs" element={<AdminCarriers />} />
              <Route path="/admin/clients" element={<AdminClients />} />
              <Route path="/transporteurs" element={<Carriers />} />
              <Route path="/nos-transporteurs/:id" element={<CarrierProfile />} />
              <Route path="/mes-tournees" element={<CarrierDashboard />} />
              <Route path="/demandes-approbation" element={<CarrierApprovalRequests />} />
              <Route path="/mes-reservations" element={<ClientReservations />} />
              <Route path="/mes-demandes-approbation" element={<ClientApprovalRequests />} />
              <Route path="/planifier-tournee" element={<PlanDelivery />} />
              <Route path="/envoyer-colis" element={<SendPackage />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
