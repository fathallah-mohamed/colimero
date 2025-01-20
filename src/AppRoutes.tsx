import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import SendPackage from "@/pages/SendPackage";
import PlanTour from "@/pages/PlanTour";
import Carriers from "@/pages/Carriers";
import Booking from "@/pages/Booking";
import MyBookings from "@/pages/MyBookings";
import MyTours from "@/pages/MyTours";
import ApprovalRequests from "@/pages/ApprovalRequests";
import MyApprovalRequests from "@/pages/MyApprovalRequests";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminClients from "@/pages/admin/Clients";
import AdminManagement from "@/pages/admin/Management";
import Recipients from "@/pages/Recipients";

export default function AppRoutes() {
  const { isAuthenticated, userType } = useAuth();

  const PrivateRoute = ({ children, allowedTypes }: { children: JSX.Element, allowedTypes?: string[] }) => {
    if (!isAuthenticated) {
      return <Navigate to="/connexion" />;
    }

    if (allowedTypes && !allowedTypes.includes(userType || '')) {
      return <Navigate to="/" />;
    }

    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/a-propos" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/inscription" element={<Register />} />
      <Route path="/transporteurs" element={<Carriers />} />
      <Route path="/envoyer-colis" element={<SendPackage />} />
      <Route path="/planifier-tournee" element={<PlanTour />} />
      
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      <Route
        path="/reserver/:tourId"
        element={
          <PrivateRoute allowedTypes={['client']}>
            <Booking />
          </PrivateRoute>
        }
      />

      <Route
        path="/mes-reservations"
        element={
          <PrivateRoute allowedTypes={['client']}>
            <MyBookings />
          </PrivateRoute>
        }
      />

      <Route
        path="/mes-tournees"
        element={
          <PrivateRoute allowedTypes={['carrier']}>
            <MyTours />
          </PrivateRoute>
        }
      />

      <Route
        path="/demandes-approbation"
        element={
          <PrivateRoute allowedTypes={['carrier']}>
            <ApprovalRequests />
          </PrivateRoute>
        }
      />

      <Route
        path="/mes-demandes-approbation"
        element={
          <PrivateRoute allowedTypes={['client']}>
            <MyApprovalRequests />
          </PrivateRoute>
        }
      />

      <Route
        path="/destinataires"
        element={
          <PrivateRoute allowedTypes={['client']}>
            <Recipients />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute allowedTypes={['admin']}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/clients"
        element={
          <PrivateRoute allowedTypes={['admin']}>
            <AdminClients />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/gestion"
        element={
          <PrivateRoute allowedTypes={['admin']}>
            <AdminManagement />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
