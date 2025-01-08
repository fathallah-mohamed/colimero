import { Button } from "@/components/ui/button";
import { UserCircle2 } from "lucide-react";
import { AccountMenu } from "./AccountMenu";

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
  return (
    <AccountMenu 
      user={user}
      userType={userType}
      onLogout={handleLogout}
    />
  );
}