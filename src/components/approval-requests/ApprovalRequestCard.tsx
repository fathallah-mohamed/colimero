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
}

export function ApprovalRequestCard({ request, onStatusChange }: ApprovalRequestCardProps) {
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
          reason={request.reason}
        />

        <RequestActions 
          request={request}
          onStatusChange={onStatusChange}
        />
      </div>
    </div>
  );
}
