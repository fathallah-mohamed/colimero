import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useSessionContext } from "@supabase/auth-helpers-react";
import Navigation from "@/components/Navigation";
import { ApprovalRequestsList } from "@/components/approval-requests/ApprovalRequestsList";
import AuthDialog from "@/components/auth/AuthDialog";
import { useState } from "react";
import { useApprovalRequests } from "@/hooks/useApprovalRequests";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { useToast } from "@/hooks/use-toast";

export default function MesDemandesApprobation() {
  const navigate = useNavigate();
  const { isLoading: isSessionLoading, session } = useSessionContext();
  const user = useUser();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const userType = user?.user_metadata?.user_type;
  const userId = user?.id;
  const { toast } = useToast();

  console.log('Current user:', user);
  console.log('User type:', userType);
  console.log('User ID:', userId);

  const { 
    requests, 
    loading, 
    error,
    handleCancelRequest,
    handleDeleteRequest
  } = useApprovalRequests(userType, userId);

  console.log('Requests:', requests);
  console.log('Loading state:', loading);
  console.log('Error:', error);

  useEffect(() => {
    if (!isSessionLoading && !session) {
      setShowAuthDialog(true);
    }
  }, [session, isSessionLoading]);

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

  if (error) {
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Une erreur est survenue lors du chargement de vos demandes"
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Mes demandes d'approbation</h1>
        {user ? (
          <ApprovalRequestsList 
            requests={requests || []}
            userType={userType}
            showActions={true}
            onCancel={handleCancelRequest}
            onDelete={handleDeleteRequest}
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