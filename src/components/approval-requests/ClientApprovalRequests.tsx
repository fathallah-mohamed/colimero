import { ApprovalRequestTabs } from "./ApprovalRequestTabs";
import { ApprovalRequest } from "@/components/admin/approval-requests/types";
import { useClientApprovalRequests } from "@/hooks/approval-requests/useClientApprovalRequests";

export function ClientApprovalRequests() {
  const {
    requests,
    loading,
    handleCancelRequest,
    handleDeleteRequest
  } = useClientApprovalRequests();

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