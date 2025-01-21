import { Card } from "@/components/ui/card";
import { ApprovalRequestHeader } from "./card/ApprovalRequestHeader";
import { ApprovalRequestActions } from "./card/ApprovalRequestActions";
import type { ApprovalRequest } from "@/components/admin/approval-requests/types";

export interface ApprovalRequestCardProps {
  request: ApprovalRequest;
  userType?: string;
  showActions?: boolean;
  onApprove: (request: ApprovalRequest) => void;
  onReject: (request: ApprovalRequest) => void;
  onCancel: (requestId: string) => void;
  onDelete: (requestId: string) => void;
}

export function ApprovalRequestCard({
  request,
  userType,
  showActions = false,
  onApprove,
  onReject,
  onCancel,
  onDelete,
}: ApprovalRequestCardProps) {
  return (
    <Card className="p-6 space-y-4">
      <ApprovalRequestHeader request={request} userType={userType} />
      
      {showActions && (
        <ApprovalRequestActions
          request={request}
          userType={userType}
          onApprove={onApprove}
          onReject={onReject}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      )}
    </Card>
  );
}