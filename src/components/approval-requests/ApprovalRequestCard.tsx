import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  onDelete?: (requestId: string) => void;
}

export function ApprovalRequestCard({ 
  request, 
  userType,
  onApprove,
  onReject,
  onCancel,
  onDelete
}: ApprovalRequestCardProps) {
  const selectedStop = request.tour?.route?.find((stop: any) => 
    stop.name === request.pickup_city
  );

  const handleCancel = () => {
    if (onCancel && request.id) {
      onCancel(request.id);
    }
  };

  const handleDelete = () => {
    if (onDelete && request.id) {
      onDelete(request.id);
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
        <div className="space-y-4 flex-grow">
          <ApprovalRequestHeader 
            tour={request.tour}
            userType={userType}
            user={request.user}
          />

          {selectedStop && (
            <CollectionPoint selectedStop={selectedStop} />
          )}

          <RequestStatus 
            status={request.status}
            message={request.message}
          />

          {request.status === 'approved' && request.tour && (
            <div className="mt-4">
              <Link 
                to={`/tours/${request.tour.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Voir la tournée
              </Link>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <RequestActions 
            status={request.status}
            userType={userType}
            onApprove={handleApprove}
            onReject={handleReject}
            onCancel={handleCancel}
          />
          
          {request.status === 'cancelled' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}