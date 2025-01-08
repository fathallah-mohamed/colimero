import { Button } from "@/components/ui/button";
import { UserCircle2 } from "lucide-react";
import { UserMenuItems } from "./UserMenuItems";

interface AuthSectionProps {
  user: any;
  userType: string | null;
  handleLogout: () => void;
  setShowAuthDialog: (show: boolean) => void;
}

export function AuthSection({ 
  user, 
  userType, 
  handleLogout, 
  setShowAuthDialog 
}: AuthSectionProps) {
  if (!user) {
    return (
      <Button 
        variant="outline" 
        onClick={() => setShowAuthDialog(true)}
        className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
      >
        <UserCircle2 className="w-4 h-4 mr-2" />
        Se connecter
      </Button>
    );
  }

  return (
    <div className="hidden md:flex md:items-center md:space-x-4">
      <UserMenuItems userType={userType} />
    </div>
  );
}