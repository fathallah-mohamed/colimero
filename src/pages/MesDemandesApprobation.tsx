import { useState } from "react";
import { useUser, useSessionContext } from "@supabase/auth-helpers-react";
import Navigation from "@/components/Navigation";
import AuthDialog from "@/components/auth/AuthDialog";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { ClientApprovalRequests } from "@/components/approval-requests/ClientApprovalRequests";
import { useClientApprovalRequests } from "@/hooks/approval-requests/useClientApprovalRequests";

export default function MesDemandesApprobation() {
  const { isLoading: isSessionLoading, session } = useSessionContext();
  const user = useUser();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  const {
    requests,
    loading,
    handleCancelRequest,
    handleDeleteRequest
  } = useClientApprovalRequests(user?.id);

  // Show auth dialog if not authenticated
  if (!isSessionLoading && !session) {
    return (
      <AuthDialog 
        isOpen={true}
        onClose={() => setShowAuthDialog(false)}
        requiredUserType="client"
      />
    );
  }

  // Show loading state
  if (isSessionLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ProfileLoading />
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
          <ClientApprovalRequests
            requests={requests}
            handleCancelRequest={handleCancelRequest}
            handleDeleteRequest={handleDeleteRequest}
          />
        ) : (
          <AuthDialog 
            isOpen={showAuthDialog} 
            onClose={() => setShowAuthDialog(false)}
            requiredUserType="client"
          />
        )}
      </div>
    </div>
  );
}