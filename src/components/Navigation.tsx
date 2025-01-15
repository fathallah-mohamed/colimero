import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import AccountMenu from "@/components/navigation/AccountMenu";
import MenuItems from "@/components/navigation/MenuItems";
import MobileMenu from "@/components/navigation/MobileMenu";
import AuthDialog from "@/components/auth/AuthDialog";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { useModalDialog } from "@/hooks/use-modal-dialog";
import { AuthSection } from "./navigation/AuthSection";

export default function Navigation() {
  const navigate = useNavigate();
  const { session, isLoading } = useSessionContext();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { isOpen, dialogState, showDialog, closeDialog } = useModalDialog();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userType = session?.user?.user_metadata?.user_type;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (event === "SIGNED_IN") {
          try {
            const { data: client, error: clientError } = await supabase
              .from('clients')
              .select('email_verified')
              .eq('id', newSession?.user?.id)
              .maybeSingle();

            if (clientError) {
              console.error("Error fetching client:", clientError);
              return;
            }

            if (client && !client?.email_verified) {
              setShowAuthDialog(false);
              showDialog({
                title: "Compte non activé",
                description: "Veuillez activer votre compte via le lien envoyé par email avant de vous connecter.",
                variant: "destructive"
              });
              await supabase.auth.signOut();
              return;
            }
          } catch (error) {
            console.error("Error checking email verification:", error);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      showDialog({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
        variant: "default"
      });
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      showDialog({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">Logo</Link>
          <div className="hidden md:flex space-x-4">
            <MenuItems />
            <AuthSection 
              user={session?.user}
              userType={userType}
              handleLogout={handleLogout}
              setShowAuthDialog={setShowAuthDialog}
            />
          </div>
          <MobileMenu 
            isOpen={mobileMenuOpen}
            setIsOpen={setMobileMenuOpen}
            user={session?.user}
            userType={userType}
            handleLogout={handleLogout}
            onLoginClick={() => setShowAuthDialog(true)}
          />
        </div>
      </nav>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={() => setShowAuthDialog(false)}
      />

      <ModalDialog
        isOpen={isOpen}
        onClose={closeDialog}
        title={dialogState.title}
        description={dialogState.description}
        variant={dialogState.variant}
      />
    </>
  );
}