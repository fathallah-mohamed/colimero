import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useApprovalRequests } from "@/hooks/useApprovalRequests";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DemandesApprobation() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const userType = session?.user?.user_metadata?.user_type;
  const userId = session?.user?.id;

  const { 
    requests, 
    loading, 
    handleApproveRequest,
    handleRejectRequest,
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

  const ApprovalRequestCard = ({ request, showActions = true }) => (
    <Card className="p-6 mb-4">
      <div className="space-y-6">
        {/* En-tête avec les informations du client */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {userType === 'carrier' 
                ? `${request.user.first_name} ${request.user.last_name}`
                : request.tour.carriers.company_name}
            </h3>
            <div className="text-sm text-gray-500 space-y-1">
              <p>Email: {request.user.email}</p>
              <p>Téléphone: {request.user.phone || "Non renseigné"}</p>
              <p>Date de la demande: {format(new Date(request.created_at), "dd MMMM yyyy", { locale: fr })}</p>
            </div>
          </div>
          <Badge variant={
            request.status === 'pending' ? 'outline' : 
            request.status === 'approved' ? 'success' : 
            'destructive'
          }>
            {request.status === 'pending' ? 'En attente' : 
             request.status === 'approved' ? 'Approuvée' : 
             'Refusée'}
          </Badge>
        </div>

        {/* Détails de la tournée */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Détails de la tournée</h4>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-500">Trajet:</span>{" "}
                {request.tour.departure_country} → {request.tour.destination_country}
              </p>
              <p>
                <span className="text-gray-500">Date de départ:</span>{" "}
                {format(new Date(request.tour.departure_date), "dd MMMM yyyy", { locale: fr })}
              </p>
              <p>
                <span className="text-gray-500">Date de collecte:</span>{" "}
                {format(new Date(request.tour.collection_date), "dd MMMM yyyy", { locale: fr })}
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Capacités</h4>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-500">Capacité totale:</span>{" "}
                {request.tour.total_capacity} kg
              </p>
              <p>
                <span className="text-gray-500">Capacité restante:</span>{" "}
                {request.tour.remaining_capacity} kg
              </p>
            </div>
          </div>
        </div>

        {/* Message du client */}
        {request.message && (
          <div>
            <h4 className="font-medium mb-2">Message du client</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {request.message}
            </p>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex justify-end gap-3">
            {request.status === 'pending' && userType === 'carrier' && (
              <>
                <Button
                  variant="default"
                  onClick={() => handleApproveRequest(request)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approuver
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleRejectRequest(request)}
                >
                  Refuser
                </Button>
              </>
            )}
            {request.status === 'pending' && userType !== 'carrier' && (
              <Button
                variant="destructive"
                onClick={() => handleCancelRequest(request.id)}
              >
                Annuler
              </Button>
            )}
            {request.status === 'cancelled' && (
              <Button
                variant="destructive"
                onClick={() => handleDeleteRequest(request.id)}
              >
                Supprimer
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-3xl font-bold mb-8">
          {userType === 'carrier' ? 'Demandes d\'approbation reçues' : 'Mes demandes d\'approbation'}
        </h1>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="pending">
              En attente ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Validées ({approvedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Refusées ({rejectedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <ScrollArea className="h-[calc(100vh-300px)]">
              {pendingRequests.map(request => (
                <ApprovalRequestCard 
                  key={request.id} 
                  request={request} 
                />
              ))}
              {pendingRequests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucune demande en attente
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="approved">
            <ScrollArea className="h-[calc(100vh-300px)]">
              {approvedRequests.map(request => (
                <ApprovalRequestCard 
                  key={request.id} 
                  request={request}
                  showActions={false}
                />
              ))}
              {approvedRequests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucune demande approuvée
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="rejected">
            <ScrollArea className="h-[calc(100vh-300px)]">
              {rejectedRequests.map(request => (
                <ApprovalRequestCard 
                  key={request.id} 
                  request={request}
                  showActions={false}
                />
              ))}
              {rejectedRequests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucune demande refusée
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}