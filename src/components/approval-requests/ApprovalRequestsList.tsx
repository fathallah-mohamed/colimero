import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { Link } from "react-router-dom";
import { ApprovalRequestCard } from "./ApprovalRequestCard";
import { useApprovalRequests } from "@/hooks/useApprovalRequests";
import { Button } from "@/components/ui/button";

export function ApprovalRequestsList() {
  const [page] = useState(1);
  const user = useUser();
  const { requests, loading, handleCancelRequest, handleDeleteRequest } = useApprovalRequests('client', user?.id);

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  if (!requests?.length) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center space-y-4">
          <p className="text-gray-500">
            Vous n'avez pas encore fait de demande d'approbation pour une tournée privée.
          </p>
          <Button asChild>
            <Link to="/tours" className="inline-flex items-center">
              Voir les tournées privées disponibles
            </Link>
          </Button>
        </div>
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