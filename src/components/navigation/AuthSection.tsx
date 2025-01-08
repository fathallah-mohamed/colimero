import { Button } from "@/components/ui/button";
import { UserCircle2, LogOut } from "lucide-react";
import { UserMenuItems } from "./UserMenuItems";
import { cn } from "@/lib/utils";

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
          className={cn(
            "border-2 border-primary text-primary",
            "hover:bg-primary hover:text-white",
            "transition-all duration-200",
            "shadow-sm hover:shadow-md",
            "bg-white/80 backdrop-blur-sm"
          )}
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
        className={cn(
          "text-red-600 hover:text-red-700",
          "border-red-200 hover:border-red-300",
          "hover:bg-red-50",
          "transition-all duration-200"
        )}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Déconnexion
      </Button>
    </div>
  );
}