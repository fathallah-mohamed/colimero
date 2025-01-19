import { ApprovalRequest } from "./types";
import { RequestCard } from "./RequestCard";

interface RequestListProps {
  requests: ApprovalRequest[];
  onSelect: (request: ApprovalRequest) => void;
  searchTerm: string;
}

export function RequestList({ requests, onSelect, searchTerm }: RequestListProps) {
  const filteredRequests = requests.filter(request =>
    request.client.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.client.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.client.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        />
      ))}
    </div>
  );
}