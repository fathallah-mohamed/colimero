import { Button } from "@/components/ui/button";
import { UserCircle2, LogOut } from "lucide-react";
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
          className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground
            transition-all duration-300 ease-in-out
            hover:shadow-[0_0_15px_rgba(155,135,245,0.5)]
            transform hover:-translate-y-0.5"
        >
          <UserCircle2 className="w-4 h-4 mr-2" />
          Se connecter
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden md:flex md:items-center md:gap-6">
      <span className="text-sm text-gray-600">{user.email}</span>
      <UserMenuItems userType={userType} />
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleLogout}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive-foreground
          transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Déconnexion
      </Button>
    </div>
  );
}