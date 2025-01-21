import { Button } from "@/components/ui/button";
import { UserCircle2 } from "lucide-react";
import AccountMenu from "./AccountMenu";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

interface AuthSectionProps {
  user: User | null;
  userType: string | null;
  handleLogout: () => void;
}

export function AuthSection({ user, userType, handleLogout }: AuthSectionProps) {
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="hidden lg:block">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/connexion')}
          className="border-2 border-[#00B0F0] text-[#00B0F0] hover:bg-[#00B0F0] hover:text-white transition-colors duration-200"
        >
          <UserCircle2 className="w-4 h-4 mr-2" />
          Se connecter
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden lg:block">
      <AccountMenu 
        userType={userType}
        onClose={handleLogout}
      />
    </div>
  );
}