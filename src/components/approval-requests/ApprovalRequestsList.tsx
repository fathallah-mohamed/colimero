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

  if (!user) {
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
    return <ProfileLoading />;
  }

  if (!requests?.length) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center space-y-4">
          <p className="text-gray-500">
            {userType === 'carrier' 
              ? "Vous n'avez pas encore reçu de demandes d'approbation pour vos tournées privées."
              : "Vous n'avez pas encore fait de demande d'approbation pour une tournée privée. Pour réserver une tournée privée, vous devez d'abord faire une demande d'approbation auprès du transporteur."}
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
          onApprove={() => handleApproveRequest(request)}
          onReject={() => handleRejectRequest(request)}
          onCancel={() => handleCancelRequest(request.id)}
          onDelete={() => handleDeleteRequest(request.id)}
        />
      ))}
    </div>
  );
}