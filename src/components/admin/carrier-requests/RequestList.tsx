import { ApprovalRequest } from "../approval-requests/types";
import { RequestCard } from "./RequestCard";

interface RequestListProps {
  requests: ApprovalRequest[];
  searchTerm: string;
  onSelect: (request: ApprovalRequest) => void;
  onApprove: (request: ApprovalRequest) => Promise<void>;
  onReject: (request: ApprovalRequest) => void;
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
      request.carrier?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.carrier?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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