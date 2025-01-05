import { useState } from "react";
import AuthDialog from "@/components/auth/AuthDialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function AccountMenu() {
  const { user, logout } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
  };

  return (
    <div>
      {user ? (
        <div className="flex items-center">
          <span className="mr-4">{user.email}</span>
          <Button onClick={handleLogout}>Déconnexion</Button>
        </div>
      ) : (
        <Button onClick={() => setIsAuthDialogOpen(true)}>Connexion</Button>
      )}
      <AuthDialog 
        open={isAuthDialogOpen} 
        onClose={() => setIsAuthDialogOpen(false)}
        fromHeader={true}
      />
    </div>
  );
}