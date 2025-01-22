import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useSessionContext } from "@supabase/auth-helpers-react";
import Navigation from "@/components/Navigation";
import AuthDialog from "@/components/auth/AuthDialog";
import { ApprovalRequestTabs } from "@/components/approval-requests/ApprovalRequestTabs";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ApprovalRequest } from "@/components/admin/approval-requests/types";

export default function MesDemandesApprobation() {
  const navigate = useNavigate();
  const { isLoading: isSessionLoading, session } = useSessionContext();
  const user = useUser();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const { toast } = useToast();
  const userType = user?.user_metadata?.user_type;

  useEffect(() => {
    if (!isSessionLoading && !session) {
      setShowAuthDialog(true);
    }
  }, [session, isSessionLoading]);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('approval_requests')
        .select(`
          *,
          tour:tours (
            *,
            carrier:carriers (
              id,
              company_name,
              email,
              phone
            )
          ),
          client:clients (
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;

      console.log('Fetched requests:', data);
      setRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les demandes d'approbation"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (request: ApprovalRequest) => {
    try {
      const { error } = await supabase
        .from('approval_requests')
        .update({
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La demande a été approuvée"
      });
      fetchRequests();
    } catch (error: any) {
      console.error('Error approving request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'approbation"
      });
    }
  };

  const handleRejectRequest = async (request: ApprovalRequest) => {
    try {
      const { error } = await supabase
        .from('approval_requests')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La demande a été rejetée"
      });
      fetchRequests();
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du rejet"
      });
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('approval_requests')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La demande a été annulée"
      });
      fetchRequests();
    } catch (error: any) {
      console.error('Error cancelling request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'annulation"
      });
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('approval_requests')
        .delete()
        .eq('id', requestId)
        .eq('user_id', user?.id)
        .eq('status', 'cancelled');

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La demande a été supprimée"
      });
      fetchRequests();
    } catch (error: any) {
      console.error('Error deleting request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression"
      });
    }
  };

  if (isSessionLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ProfileLoading />
        </div>
      </div>
    );
  }

  const pendingRequests = requests.filter(req => req.status === 'pending') || [];
  const approvedRequests = requests.filter(req => req.status === 'approved') || [];
  const rejectedRequests = requests.filter(req => 
    req.status === 'rejected' || req.status === 'cancelled'
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Mes demandes d'approbation</h1>
        {user ? (
          <ApprovalRequestTabs
            pendingRequests={pendingRequests}
            approvedRequests={approvedRequests}
            rejectedRequests={rejectedRequests}
            userType={userType}
            handleApproveRequest={handleApproveRequest}
            handleRejectRequest={handleRejectRequest}
            handleCancelRequest={handleCancelRequest}
            handleDeleteRequest={handleDeleteRequest}
          />
        ) : (
          <AuthDialog 
            isOpen={showAuthDialog} 
            onClose={() => setShowAuthDialog(false)}
            requiredUserType="client"
          />
        )}
      </div>
    </div>
  );
}