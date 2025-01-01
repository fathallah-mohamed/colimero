import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useApprovalRequests } from "@/hooks/useApprovalRequests";
import { ApprovalRequestCard } from "@/components/approval-requests/ApprovalRequestCard";

export default function DemandesApprobation() {
  const navigate = useNavigate();
  const { data: { session } } = await supabase.auth.getSession();
  const userType = session?.user?.user_metadata?.user_type;
  const userId = session?.user?.id;

  const { 
    requests, 
    loading, 
    handleApproval, 
    handleCancelRequest 
  } = useApprovalRequests(userType, userId);

  useEffect(() => {
    if (!session) {
      navigate('/connexion');
    }
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">
          {userType === 'carrier' ? 'Demandes d\'approbation reçues' : 'Mes demandes d\'approbation'}
        </h1>
        <div className="grid gap-6">
          {requests.map((request) => (
            <ApprovalRequestCard
              key={request.id}
              request={request}
              userType={userType}
              onApprove={userType === 'carrier' ? (id) => handleApproval(id, true) : undefined}
              onReject={userType === 'carrier' ? (id) => handleApproval(id, false) : undefined}
              onCancel={userType !== 'carrier' ? handleCancelRequest : undefined}
            />
          ))}
          {requests.length === 0 && (
            <p className="text-gray-600 text-center py-8">
              Aucune demande d'approbation
            </p>
          )}
        </div>
      </div>
    </div>
  );
}