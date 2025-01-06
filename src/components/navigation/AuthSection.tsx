import { Button } from "@/components/ui/button";
import { UserCircle2 } from "lucide-react";
import { UserMenuItems } from "./UserMenuItems";

interface AuthSectionProps {
  user: any;
  userType: string | null;
  handleLogout: () => void;
  setShowAuthDialog: (show: boolean) => void;
}

export function AuthSection({ user, userType, handleLogout, setShowAuthDialog }: AuthSectionProps) {
  if (!user) {
    return (
      <div className="hidden md:block">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowAuthDialog(true)}
          className="border-2 border-[#00B0F0] text-[#00B0F0] hover:bg-[#00B0F0] hover:text-white transition-colors duration-200"
        >
          <UserCircle2 className="w-4 h-4 mr-2" />
          Se connecter
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden md:flex md:items-center md:space-x-4">
      <span className="text-sm text-gray-600">{user.email}</span>
      <UserMenuItems userType={userType} />
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleLogout}
        className="text-red-600 hover:text-red-700"
      >
        Déconnexion
      </Button>
    </div>
  );
}