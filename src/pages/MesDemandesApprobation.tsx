import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useSessionContext } from "@supabase/auth-helpers-react";
import Navigation from "@/components/Navigation";
import { ApprovalRequestsList } from "@/components/approval-requests/ApprovalRequestsList";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useState } from "react";

export default function MesDemandesApprobation() {
  const navigate = useNavigate();
  const { isLoading: isSessionLoading, session } = useSessionContext();
  const user = useUser();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    if (!isSessionLoading && !session) {
      setShowAuthDialog(true);
    }
  }, [session, isSessionLoading]);

  if (isSessionLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Mes demandes d'approbation</h1>
        {user ? (
          <ApprovalRequestsList />
        ) : (
          <AuthDialog 
            open={showAuthDialog} 
            onClose={() => setShowAuthDialog(false)}
            requiredUserType="client"
          />
        )}
      </div>
    </div>
  );
}