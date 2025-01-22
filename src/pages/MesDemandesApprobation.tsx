import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useSessionContext } from "@supabase/auth-helpers-react";
import Navigation from "@/components/Navigation";
import AuthDialog from "@/components/auth/AuthDialog";
import { useState } from "react";
import { useApprovalRequests } from "@/hooks/useApprovalRequests";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { ApprovalRequestTabs } from "@/components/approval-requests/ApprovalRequestTabs";
import { useToast } from "@/hooks/use-toast";

export default function MesDemandesApprobation() {
  const navigate = useNavigate();
  const { isLoading: isSessionLoading, session } = useSessionContext();
  const user = useUser();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const userType = user?.user_metadata?.user_type;
  const userId = user?.id;
  const { toast } = useToast();

  const {
    requests,
    loading,
    handleApproveRequest,
    handleRejectRequest,
    handleCancelRequest,
    handleDeleteRequest
  } = useApprovalRequests(userType, userId);

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

  const pendingRequests = requests?.filter(req => req.status === 'pending') || [];
  const approvedRequests = requests?.filter(req => req.status === 'approved') || [];
  const rejectedRequests = requests?.filter(req => 
    req.status === 'rejected' || req.status === 'cancelled'
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Mes demandes d'approbation</h1>
        {user ? (
          <ApprovalRequestTabs
            pendingRequests={pendingRequests}
            approvedRequests={approvedRequests}
            rejectedRequests={rejectedRequests}
            userType={userType}
            handleApproveRequest={handleApproveRequest}
            handleRejectRequest={handleRejectRequest}
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