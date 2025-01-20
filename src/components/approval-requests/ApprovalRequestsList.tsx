import { ApprovalRequestCard } from "./ApprovalRequestCard";

interface ApprovalRequestListProps {
  requests: any[];
  userType?: string;
  showActions?: boolean;
  onApprove?: (request: any) => void;
  onReject?: (request: any) => void;
  onCancel?: (request: any) => void;
  onDelete?: (request: any) => void;
}

export function ApprovalRequestsList({
  requests,
  userType,
  showActions = false,
  onApprove,
  onReject,
  onCancel,
  onDelete
}: ApprovalRequestListProps) {
  console.log("ApprovalRequestsList - Requests:", requests);
  console.log("ApprovalRequestsList - UserType:", userType);

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Vous n'avez pas encore de demandes d'approbation
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map(request => (
        <ApprovalRequestCard
          key={request.id}
          request={request}
          userType={userType}
          showActions={showActions}
          onApprove={onApprove}
          onReject={onReject}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}