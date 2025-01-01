import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function DemandesApprobation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    fetchRequests();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/connexion');
    }
  };

  const fetchRequests = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      // First fetch approval requests with tour data
      const { data: approvalData, error: approvalError } = await supabase
        .from('approval_requests')
        .select(`
          *,
          tour:tours (
            departure_country,
            destination_country,
            departure_date,
            route,
            total_capacity,
            remaining_capacity
          )
        `)
        .eq('tour.carrier_id', session.user.id)
        .order('created_at', { ascending: false });

      if (approvalError) {
        console.error('Error fetching requests:', approvalError);
        return;
      }

      // Then fetch user data for each request
      if (approvalData) {
        const requestsWithUserData = await Promise.all(
          approvalData.map(async (request) => {
            const { data: userData } = await supabase
              .from('clients')
              .select('first_name, last_name, phone')
              .eq('id', request.user_id)
              .single();

            return {
              ...request,
              user: userData
            };
          })
        );

        setRequests(requestsWithUserData);
      }
    }
    setLoading(false);
  };

  const handleApproval = async (requestId: string, approved: boolean) => {
    const { error } = await supabase
      .from('approval_requests')
      .update({
        status: approved ? 'approved' : 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la demande.",
      });
      return;
    }

    toast({
      title: "Succès",
      description: `La demande a été ${approved ? 'approuvée' : 'rejetée'} avec succès.`,
    });

    fetchRequests();
  };

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
        <h1 className="text-3xl font-bold mb-8">Demandes d'approbation</h1>
        <div className="grid gap-6">
          {requests.map((request) => (
            <div key={request.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {request.tour?.departure_country} → {request.tour?.destination_country}
                    </h2>
                    <p className="text-gray-600">
                      Client : {request.user?.first_name} {request.user?.last_name}
                    </p>
                    {request.user?.phone && (
                      <p className="text-gray-600">
                        Téléphone : {request.user.phone}
                      </p>
                    )}
                    <p className="text-gray-600">
                      Date de départ : {request.tour?.departure_date ? 
                        format(new Date(request.tour.departure_date), "EEEE d MMMM yyyy", { locale: fr }) : 
                        'Non spécifiée'}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">Points de collecte :</h3>
                    <ul className="mt-2 space-y-2">
                      {request.tour?.route?.map((stop: any, index: number) => (
                        <li key={index} className="text-sm text-gray-600">
                          {stop.name} - {stop.location} ({stop.time})
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-600">
                      Statut : <span className={`font-medium ${
                        request.status === 'pending' ? 'text-yellow-600' :
                        request.status === 'approved' ? 'text-green-600' :
                        'text-red-600'
                      }`}>
                        {request.status === 'pending' ? 'En attente' :
                         request.status === 'approved' ? 'Approuvée' :
                         request.status === 'cancelled' ? 'Annulée' :
                         'Rejetée'}
                      </span>
                    </p>
                    {request.message && (
                      <p className="text-gray-600 mt-2">
                        Message : {request.message}
                      </p>
                    )}
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleApproval(request.id, false)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Rejeter
                    </Button>
                    <Button
                      onClick={() => handleApproval(request.id, true)}
                    >
                      Approuver
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {requests.length === 0 && (
            <p className="text-gray-600 text-center py-8">
              Aucune demande d'approbation en attente
            </p>
          )}
        </div>
      </div>
    </div>
  );
}