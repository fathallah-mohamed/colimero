import React from "react";
import { CollectionPoint } from "./CollectionPoint";
import { RequestHeader } from "./RequestHeader";
import { RequestStatus } from "./RequestStatus";
import { RequestActions } from "./RequestActions";

interface ApprovalRequestCardProps {
  request: {
    tour: any;
    user: any;
    status: string;
    reason: string;
    pickup_city: string;
  };
  onStatusChange: (status: string) => void;
  userType?: string;
  onApprove?: () => void;
  onReject?: () => void;
  onCancel?: (requestId: string) => void;
  onDelete?: (requestId: string) => void;
}

export function ApprovalRequestCard({ 
  request, 
  onStatusChange,
  userType,
  onApprove,
  onReject,
  onCancel,
  onDelete 
}: ApprovalRequestCardProps) {
  const selectedStop = request.tour?.route?.find(
    (stop: any) => stop.name === request.pickup_city
  );

  return (
    <div className="space-y-4 p-6 bg-white rounded-xl shadow-sm">
      <div className="space-y-6">
        <RequestHeader 
          tour={request.tour}
          user={request.user}
        />

        {selectedStop && (
          <CollectionPoint selectedStop={selectedStop} />
        )}

        <RequestStatus 
          status={request.status}
          message={request.reason}
        />

        <RequestActions 
          status={request.status}
          userType={userType}
          onApprove={onApprove}
          onReject={onReject}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}