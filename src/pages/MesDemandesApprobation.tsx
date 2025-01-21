import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useSessionContext } from "@supabase/auth-helpers-react";
import Navigation from "@/components/Navigation";
import AuthDialog from "@/components/auth/AuthDialog";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useApprovalRequests } from "@/hooks/useApprovalRequests";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { ApprovalRequestCard } from "@/components/approval-requests/ApprovalRequestCard";

export default function MesDemandesApprobation() {
  const navigate = useNavigate();
  const { isLoading: isSessionLoading, session } = useSessionContext();
  const user = useUser();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const userType = user?.user_metadata?.user_type;
  const userId = user?.id;

  const { 
    requests, 
    loading, 
    handleCancelRequest,
    handleDeleteRequest
  } = useApprovalRequests(userType, userId);

  useEffect(() => {
    if (!isSessionLoading && !session) {
      setShowAuthDialog(true);
    }
  }, [session, isSessionLoading]);

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

  const pendingRequests = requests?.filter(req => req.status === 'pending') || [];
  const approvedRequests = requests?.filter(req => req.status === 'approved') || [];
  const rejectedRequests = requests?.filter(req => req.status === 'rejected' || req.status === 'cancelled') || [];

  // Placeholder functions for required props
  const handleApprove = () => Promise.resolve();
  const handleReject = () => Promise.resolve();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Mes demandes d'approbation</h1>
        {user ? (
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
                    showActions={true}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onCancel={handleCancelRequest}
                    onDelete={handleDeleteRequest}
                  />
                ))
              ) : (
                <div className="bg-white shadow rounded-lg p-6">
                  <p className="text-gray-600 text-center">
                    Aucune demande en attente
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-6">
              {approvedRequests.length > 0 ? (
                approvedRequests.map((request) => (
                  <ApprovalRequestCard
                    key={request.id}
                    request={request}
                    userType={userType}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onCancel={handleCancelRequest}
                    onDelete={handleDeleteRequest}
                  />
                ))
              ) : (
                <div className="bg-white shadow rounded-lg p-6">
                  <p className="text-gray-600 text-center">
                    Aucune demande validée
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-6">
              {rejectedRequests.length > 0 ? (
                rejectedRequests.map((request) => (
                  <ApprovalRequestCard
                    key={request.id}
                    request={request}
                    userType={userType}
                    showActions={true}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onCancel={handleCancelRequest}
                    onDelete={handleDeleteRequest}
                  />
                ))
              ) : (
                <div className="bg-white shadow rounded-lg p-6">
                  <p className="text-gray-600 text-center">
                    Aucune demande refusée
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
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