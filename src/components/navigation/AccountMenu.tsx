import { useState } from "react";
import AuthDialog from "@/components/auth/AuthDialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function AccountMenu() {
  const { user } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
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