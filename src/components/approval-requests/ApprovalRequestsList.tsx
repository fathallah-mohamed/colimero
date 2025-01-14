import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { Link } from "react-router-dom";
import { ApprovalRequestCard } from "./ApprovalRequestCard";
import { useApprovalRequests } from "@/hooks/useApprovalRequests";
import { Button } from "@/components/ui/button";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { useToast } from "@/hooks/use-toast";

export function ApprovalRequestsList() {
  const [page] = useState(1);
  const user = useUser();
  const userType = user?.user_metadata?.user_type;
  const { toast } = useToast();
  
  const { 
    requests, 
    loading, 
    handleApproveRequest,
    handleRejectRequest,
    handleCancelRequest, 
    handleDeleteRequest 
  } = useApprovalRequests(userType, user?.id);

  console.log('Current user:', user);
  console.log('User type:', userType);
  console.log('User ID:', user?.id);
  console.log('Approval requests:', requests);

  if (!user) {
    console.log('No user found');
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center space-y-4">
          <p className="text-gray-500">
            Veuillez vous connecter pour voir vos demandes d'approbation
          </p>
          <Button asChild>
            <Link to="/connexion" className="inline-flex items-center">
              Se connecter
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    console.log('Loading state');
    return <ProfileLoading />;
  }

  if (!requests?.length) {
    console.log('No requests found');
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

  console.log('Rendering requests list:', requests.length, 'items');
  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <ApprovalRequestCard 
          key={request.id} 
          request={request} 
          userType={userType}
          onApprove={() => handleApproveRequest(request)}
          onReject={() => handleRejectRequest(request)}
          onCancel={() => handleCancelRequest(request.id)}
          onDelete={() => handleDeleteRequest(request.id)}
        />
      ))}
    </div>
  );
}