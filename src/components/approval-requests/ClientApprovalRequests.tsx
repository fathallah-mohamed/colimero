import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ApprovalRequestTabs } from "./ApprovalRequestTabs";
import { useClientApprovalRequests } from "@/hooks/approval-requests/useClientApprovalRequests";

export function ClientApprovalRequests() {
  const navigate = useNavigate();
  const {
    requests,
    loading,
    handleCancelRequest,
    handleDeleteRequest
  } = useClientApprovalRequests(supabase.auth.getUser().then(({ data }) => data.user?.id));

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/connexion");
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement des demandes...</div>
      </div>
    );
  }

  const pendingRequests = requests.filter(req => req.status === 'pending') || [];
  const approvedRequests = requests.filter(req => req.status === 'approved') || [];
  const rejectedRequests = requests.filter(req => 
    req.status === 'rejected' || req.status === 'cancelled'
  ) || [];

  return (
    <ApprovalRequestTabs
      pendingRequests={pendingRequests}
      approvedRequests={approvedRequests}
      rejectedRequests={rejectedRequests}
      userType="client"
      handleApproveRequest={() => {}}
      handleRejectRequest={() => {}}
      handleCancelRequest={handleCancelRequest}
      handleDeleteRequest={handleDeleteRequest}
    />
  );
}