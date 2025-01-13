import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { Link } from "react-router-dom";
import { ApprovalRequestCard } from "./ApprovalRequestCard";
import { useApprovalRequests } from "@/hooks/useApprovalRequests";
import { Button } from "@/components/ui/button";
import { ProfileLoading } from "@/components/profile/ProfileLoading";

export function ApprovalRequestsList() {
  const [page] = useState(1);
  const user = useUser();
  const userType = user?.user_metadata?.user_type;
  const { requests, loading, handleCancelRequest, handleDeleteRequest } = useApprovalRequests(userType, user?.id);

  console.log('Current user:', user);
  console.log('User type:', userType);
  console.log('Approval requests:', requests);

  if (loading) {
    return <ProfileLoading />;
  }

  if (!requests?.length) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center space-y-4">
          <p className="text-gray-500">
            {userType === 'carrier' 
              ? "Vous n'avez pas encore reçu de demandes d'approbation pour vos tournées privées."
              : "Vous n'avez pas encore fait de demande d'approbation pour une tournée privée."}
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
          userType={userType}
          onStatusChange={() => {}}
          onCancel={() => handleCancelRequest(request.id)}
          onDelete={() => handleDeleteRequest(request.id)}
        />
      ))}
    </div>
  );
}