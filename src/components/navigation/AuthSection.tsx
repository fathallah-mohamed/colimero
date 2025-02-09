import { Button } from "@/components/ui/button";
import { UserCircle2 } from "lucide-react";
import AccountMenu from "./AccountMenu";

interface AuthSectionProps {
  user: any;
  userType: string | null;
  handleLogout: () => void;
  setShowAuthDialog: () => void;
}

export function AuthSection({ user, userType, handleLogout, setShowAuthDialog }: AuthSectionProps) {
  if (!user) {
    return (
      <div className="hidden lg:block">
        <Button 
          variant="outline" 
          size="sm"
          onClick={setShowAuthDialog}
          className="border-2 border-[#00B0F0] text-[#00B0F0] hover:bg-[#00B0F0] hover:text-white transition-colors duration-200"
          data-login-button
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