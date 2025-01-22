import { useState } from "react";
import { SearchBar } from "./approval-requests/SearchBar";
import { RequestDetailsDialog } from "./RequestDetailsDialog";
import { Loader2 } from "lucide-react";
import { RequestList } from "./carrier-requests/RequestList";
import { ApprovalRequest } from "./approval-requests/types";
import { useRegistrationRequests } from "./registration/useRegistrationRequests";
import { useRegistrationActions } from "./registration/useRegistrationActions";

export default function NewRegistrationRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  
  const { requests = [], isLoading, refetch } = useRegistrationRequests();
  const { handleApprove, handleReject } = useRegistrationActions(refetch);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      
      <RequestList
        requests={requests}
        searchTerm={searchTerm}
        onSelect={setSelectedRequest}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <RequestDetailsDialog
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}