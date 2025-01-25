import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";

export function useAuthRedirect() {
  const navigate = useNavigate();

  const handleSuccessfulAuth = (user: User) => {
    const returnPath = sessionStorage.getItem('returnPath');
    const userType = user.user_metadata?.user_type;

    if (returnPath) {
      sessionStorage.removeItem('returnPath');
      navigate(returnPath);
      return;
    }

    switch (userType) {
      case 'admin':
        navigate("/admin");
        break;
      case 'carrier':
        navigate("/mes-tournees");
        break;
      default:
        navigate("/");
    }
  };

  return { handleSuccessfulAuth };
}