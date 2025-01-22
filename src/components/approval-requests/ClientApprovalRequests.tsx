import { ApprovalRequestTabs } from "./ApprovalRequestTabs";
import { ApprovalRequest } from "@/components/admin/approval-requests/types";

interface ClientApprovalRequestsProps {
  requests: ApprovalRequest[];
  handleCancelRequest: (requestId: string) => void;
  handleDeleteRequest: (requestId: string) => void;
}

export function ClientApprovalRequests({
  requests,
  handleCancelRequest,
  handleDeleteRequest
}: ClientApprovalRequestsProps) {
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