import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useProtectedRoute() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkProtectedRoute = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const protectedRoutes = ['/mes-reservations', '/profile', '/demandes-approbation'];
        
        if (protectedRoutes.includes(location.pathname)) {
          if (!session) {
            console.log("Protected route access attempt without session");
            sessionStorage.setItem('returnPath', location.pathname);
            navigate('/connexion', { replace: true });
          }
        }
      } catch (error) {
        console.error("Error checking protected route:", error);
      }
    };

    checkProtectedRoute();
  }, [navigate, location.pathname]);
}