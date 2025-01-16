import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useApprovalRequests } from "@/hooks/useApprovalRequests";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  const RequestsTable = ({ requests, showActions = true }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date de demande</TableHead>
            <TableHead>{userType === 'carrier' ? 'Client' : 'Transporteur'}</TableHead>
            <TableHead>Tournée</TableHead>
            <TableHead>Ville de collecte</TableHead>
            <TableHead>Message</TableHead>
            {showActions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                {format(new Date(request.created_at), "dd MMMM yyyy", { locale: fr })}
              </TableCell>
              <TableCell>
                {userType === 'carrier' 
                  ? `${request.user.first_name} ${request.user.last_name}`
                  : request.tour.carriers.company_name
                }
              </TableCell>
              <TableCell>
                {request.tour.departure_country} → {request.tour.destination_country}
                <br />
                <Badge variant="outline" className="mt-1">
                  {format(new Date(request.tour.departure_date), "dd/MM/yyyy")}
                </Badge>
              </TableCell>
              <TableCell>{request.pickup_city}</TableCell>
              <TableCell>{request.message || "-"}</TableCell>
              {showActions && (
                <TableCell>
                  <div className="flex gap-2">
                    {request.status === 'pending' && userType === 'carrier' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApproveRequest(request)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectRequest(request)}
                        >
                          Refuser
                        </Button>
                      </>
                    )}
                    {request.status === 'pending' && userType !== 'carrier' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancelRequest(request.id)}
                      >
                        Annuler
                      </Button>
                    )}
                    {request.status === 'cancelled' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteRequest(request.id)}
                      >
                        Supprimer
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
          {requests.length === 0 && (
            <TableRow>
              <TableCell colSpan={showActions ? 6 : 5} className="text-center py-8 text-gray-500">
                Aucune demande dans cette catégorie
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
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
            <RequestsTable requests={pendingRequests} />
          </TabsContent>

          <TabsContent value="approved">
            <RequestsTable requests={approvedRequests} showActions={false} />
          </TabsContent>

          <TabsContent value="rejected">
            <RequestsTable requests={rejectedRequests} showActions={false} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}