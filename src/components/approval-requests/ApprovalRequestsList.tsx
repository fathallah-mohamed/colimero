import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { ApprovalRequestCard } from "./ApprovalRequestCard";
import { useApprovalRequests } from "@/hooks/useApprovalRequests";

export function ApprovalRequestsList() {
  const [page] = useState(1);
  const user = useUser();
  const { requests, loading, handleCancelRequest, handleDeleteRequest } = useApprovalRequests('client', user?.id);

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  if (!requests?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune demande d'approbation trouvée
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <ApprovalRequestCard 
          key={request.id} 
          request={request} 
          userType="client"
          onCancel={handleCancelRequest}
          onDelete={handleDeleteRequest}
        />
      ))}
    </div>
  );
}