import { ApprovalRequest } from "./types";
import { RequestCard } from "./RequestCard";

interface RequestListProps {
  requests: ApprovalRequest[];
  onSelect: (request: ApprovalRequest) => void;
  searchTerm: string;
  onApprove: (request: ApprovalRequest) => Promise<void>;
  onReject: (request: ApprovalRequest) => Promise<void>;
}

export function RequestList({ requests, onSelect, searchTerm, onApprove, onReject }: RequestListProps) {
  const filteredRequests = requests.filter(request =>
    request.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.email?.toLowerCase().includes(searchTerm.toLowerCase()) || ''
  );

  if (filteredRequests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune demande trouvée</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredRequests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onClick={() => onSelect(request)}
          onApprove={() => onApprove(request)}
          onReject={() => onReject(request)}
        />
      ))}
    </div>
  );
}