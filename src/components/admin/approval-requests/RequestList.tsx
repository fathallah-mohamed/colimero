import { Carrier } from "@/types/carrier";
import { RequestCard } from "./RequestCard";

interface RequestListProps {
  requests: Carrier[];
  searchTerm: string;
  onSelect: (request: Carrier) => void;
  onApprove: (request: Carrier) => void;
  onReject: (request: Carrier, reason: string) => void;
}

export function RequestList({
  requests,
  searchTerm,
  onSelect,
  onApprove,
  onReject,
}: RequestListProps) {
  const filteredRequests = requests.filter(
    (request) =>
      request.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredRequests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune demande d'inscription en attente
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredRequests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onSelect={() => onSelect(request)}
          onApprove={() => onApprove(request)}
          onReject={(reason) => onReject(request, reason)}
        />
      ))}
    </div>
  );
}