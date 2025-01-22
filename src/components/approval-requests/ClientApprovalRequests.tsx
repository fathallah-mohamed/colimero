import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ApprovalRequestTabs } from "./ApprovalRequestTabs";
import { useClientApprovalRequests } from "@/hooks/approval-requests/useClientApprovalRequests";
import { ProfileLoading } from "@/components/profile/ProfileLoading";

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

  const pendingRequests = useMemo(() => 
    requests.filter(req => req.status === 'pending') || [], [requests]
  );
  
  const approvedRequests = useMemo(() => 
    requests.filter(req => req.status === 'approved') || [], [requests]
  );
  
  const rejectedRequests = useMemo(() => 
    requests.filter(req => 
      req.status === 'rejected' || req.status === 'cancelled'
    ) || [], [requests]
  );

  if (loading) {
    return <ProfileLoading />;
  }

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