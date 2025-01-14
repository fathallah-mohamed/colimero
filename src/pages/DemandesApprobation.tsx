import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useApprovalRequests } from "@/hooks/useApprovalRequests";
import { ApprovalRequestCard } from "@/components/approval-requests/ApprovalRequestCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DemandesApprobation() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const userType = session?.user?.user_metadata?.user_type;
  const userId = session?.user?.id;

  const { 
    requests, 
    loading, 
    handleCancelRequest,
    handleDeleteRequest
  } = useApprovalRequests(userType, userId);

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setIsLoading(false);

      if (!session) {
        navigate('/connexion');
      }
    }

    getSession();
  }, [navigate]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  const pendingRequests = requests?.filter(req => req.status === 'pending') || [];
  const approvedRequests = requests?.filter(req => req.status === 'approved') || [];
  const rejectedRequests = requests?.filter(req => req.status === 'rejected') || [];

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-3xl font-bold mb-8">
          {userType === 'carrier' ? 'Demandes d\'approbation reçues' : 'Mes demandes d\'approbation'}
        </h1>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              En attente ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Validées ({approvedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Refusées ({rejectedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            {pendingRequests.length > 0 ? (
              pendingRequests.map((request) => (
                <ApprovalRequestCard
                  key={request.id}
                  request={request}
                  userType={userType}
                  onStatusChange={() => {}}
                  onCancel={() => handleCancelRequest(request.id)}
                  onDelete={() => handleDeleteRequest(request.id)}
                />
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">
                Aucune demande en attente
              </p>
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-6">
            {approvedRequests.length > 0 ? (
              approvedRequests.map((request) => (
                <ApprovalRequestCard
                  key={request.id}
                  request={request}
                  userType={userType}
                  onStatusChange={() => {}}
                  onCancel={() => handleCancelRequest(request.id)}
                  onDelete={() => handleDeleteRequest(request.id)}
                />
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">
                Aucune demande validée
              </p>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-6">
            {rejectedRequests.length > 0 ? (
              rejectedRequests.map((request) => (
                <ApprovalRequestCard
                  key={request.id}
                  request={request}
                  userType={userType}
                  onStatusChange={() => {}}
                  onCancel={() => handleCancelRequest(request.id)}
                  onDelete={() => handleDeleteRequest(request.id)}
                />
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">
                Aucune demande refusée
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}