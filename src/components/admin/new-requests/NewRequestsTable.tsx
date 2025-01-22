import { ApprovalRequest } from "@/hooks/approval-requests/types";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";

export interface NewRequestsTableProps {
  requests: ApprovalRequest[];
  onViewDetails: (request: ApprovalRequest) => void;
  showApproveButton: boolean;
  onApprove: (request: ApprovalRequest) => void;
  onReject: (request: ApprovalRequest) => void;
}

export function NewRequestsTable({
  requests,
  onViewDetails,
  showApproveButton,
  onApprove,
  onReject
}: NewRequestsTableProps) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Client</th>
          <th>Message</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request) => (
          <tr key={request.id}>
            <td>
              {request.client ? (
                `${request.client.first_name || ''} ${request.client.last_name || ''}`
              ) : (
                'Client non disponible'
              )}
            </td>
            <td>{request.message || '-'}</td>
            <td>{request.status}</td>
            <td>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewDetails(request)}
                >
                  View
                </Button>
                {showApproveButton && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onApprove(request)}
                  >
                    Approve
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onReject(request)}
                >
                  Reject
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}