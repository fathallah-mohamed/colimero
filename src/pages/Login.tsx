import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import Navigation from "@/components/Navigation";
import AuthDialog from "@/components/auth/AuthDialog";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUser();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AuthDialog 
          isOpen={true} 
          onClose={() => navigate("/")}
          onSuccess={() => navigate(from, { replace: true })}
        />
      </div>
    </div>
  );
}