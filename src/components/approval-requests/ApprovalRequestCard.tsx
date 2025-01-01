import { ApprovalRequestHeader } from "./ApprovalRequestHeader";
import { CollectionPoint } from "./CollectionPoint";
import { RequestStatus } from "./RequestStatus";
import { RequestActions } from "./RequestActions";

interface ApprovalRequestCardProps {
  request: any;
  userType: string | null;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  onCancel?: (requestId: string) => void;
}

export function ApprovalRequestCard({ 
  request, 
  userType,
  onApprove,
  onReject,
  onCancel
}: ApprovalRequestCardProps) {
  const selectedStop = request.tour?.route?.find((stop: any) => 
    stop.name === request.pickup_city
  );

  const handleCancel = () => {
    console.log('Cancel clicked for request:', request.id);
    if (onCancel && request.id) {
      onCancel(request.id);
    }
  };

  const handleApprove = () => {
    if (onApprove && request.id) {
      onApprove(request.id);
    }
  };

  const handleReject = () => {
    if (onReject && request.id) {
      onReject(request.id);
    }
  };

  return (
    <div key={request.id} className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          <ApprovalRequestHeader 
            tour={request.tour}
            userType={userType}
            user={request.user}
          />

          <CollectionPoint 
            pickupCity={request.pickup_city}
            selectedStop={selectedStop}
            collectionDate={selectedStop?.collection_date || request.tour?.collection_date}
          />

          <RequestStatus 
            status={request.status}
            message={request.message}
          />
        </div>

        <RequestActions 
          status={request.status}
          userType={userType}
          onApprove={handleApprove}
          onReject={handleReject}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}