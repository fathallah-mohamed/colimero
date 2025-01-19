import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import RequestDetailsDialog from "./RequestDetailsDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NewRequestsTable } from "./new-requests/NewRequestsTable";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface Carrier {
  id: string;
  company_name: string;
  email: string;
  phone: string;
}

interface Tour {
  id: number;
  departure_country: string;
  destination_country: string;
  departure_date: string;
  collection_date: string;
  route: any;
  total_capacity: number;
  remaining_capacity: number;
  carriers: Carrier;
}

interface ApprovalRequest {
  id: string;
  status: string;
  tour: Tour;
  clients: Client;
}

export default function NewRegistrationRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);

  const { data: requests, isLoading } = useQuery<ApprovalRequest[]>({
    queryKey: ["approval-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("approval_requests")
        .select(`
          *,
          tour:tours!inner (
            id,
            departure_country,
            destination_country,
            departure_date,
            collection_date,
            route,
            total_capacity,
            remaining_capacity,
            carriers!inner (
              id,
              company_name,
              email,
              phone
            )
          ),
          clients!inner (
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching approval requests:", error);
        throw error;
      }
      
      console.log("Fetched approval requests:", data);
      return data;
    },
  });

  const filteredRequests = requests?.filter((request) =>
    request.clients?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.clients?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.clients?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingRequests = filteredRequests?.filter(req => req.status === 'pending') || [];
  const approvedRequests = filteredRequests?.filter(req => req.status === 'approved') || [];
  const rejectedRequests = filteredRequests?.filter(req => req.status === 'rejected') || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 space-y-4">
        <h1 className="text-3xl font-bold mb-8">
          Demandes d'approbation reçues
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

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
            <ScrollArea className="rounded-lg border h-[calc(100vh-300px)]">
              <NewRequestsTable
                requests={pendingRequests}
                onViewDetails={setSelectedRequest}
                showApproveButton={true}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="approved">
            <ScrollArea className="rounded-lg border h-[calc(100vh-300px)]">
              <NewRequestsTable
                requests={approvedRequests}
                onViewDetails={setSelectedRequest}
                showApproveButton={false}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="rejected">
            <ScrollArea className="rounded-lg border h-[calc(100vh-300px)]">
              <NewRequestsTable
                requests={rejectedRequests}
                onViewDetails={setSelectedRequest}
                showApproveButton={false}
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <RequestDetailsDialog
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      </div>
    </div>
  );
}