import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { ApprovalRequestTabs } from "@/components/approval-requests/ApprovalRequestTabs";
import { useApprovalRequests } from "@/hooks/useApprovalRequests";

export default function DemandesApprobation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  const {
    requests,
    loading,
    error,
    handleApproveRequest,
    handleRejectRequest,
    handleCancelRequest,
    handleDeleteRequest
  } = useApprovalRequests(userType, userId);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous devez être connecté pour accéder à cette page.",
        });
        navigate("/connexion");
        return;
      }

      const userType = session.user.user_metadata?.user_type;
      if (userType !== 'carrier') {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Cette page est réservée aux transporteurs.",
        });
        navigate("/");
        return;
      }

      setUserId(session.user.id);
      setUserType(userType);
    };

    checkAuth();
  }, [navigate, toast]);

  const pendingRequests = requests.filter(request => request.status === 'pending');
  const approvedRequests = requests.filter(request => request.status === 'approved');
  const rejectedRequests = requests.filter(request => request.status === 'rejected');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Chargement des demandes...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">Une erreur est survenue lors du chargement des demandes.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Demandes d'approbation
          </h1>
        </div>

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
      </div>
    </div>
  );
}