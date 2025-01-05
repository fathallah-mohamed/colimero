import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NewRequestCard } from "./new-requests/NewRequestCard";
import { NewRequestsTable } from "./new-requests/NewRequestsTable";
import Navigation from "@/components/Navigation";
import RequestDetailsDialog from "./RequestDetailsDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NewRegistrationRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const { data: pendingRequests, isLoading: isPendingLoading } = useQuery({
    queryKey: ["carrier-requests", "pending"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carrier_registration_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: approvedRequests, isLoading: isApprovedLoading } = useQuery({
    queryKey: ["carrier-requests", "approved"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carrier_registration_requests")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: rejectedRequests, isLoading: isRejectedLoading } = useQuery({
    queryKey: ["carrier-requests", "rejected"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carrier_registration_requests")
        .select("*")
        .eq("status", "rejected")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filterRequests = (requests: any[] | null) => {
    if (!requests) return [];
    return requests.filter(
      (request) =>
        request.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const isLoading = isPendingLoading || isApprovedLoading || isRejectedLoading;

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

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="approved">Validés</TabsTrigger>
            <TabsTrigger value="rejected">Rejetés</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="hidden md:block">
              <ScrollArea className="rounded-lg border h-[calc(100vh-300px)]">
                <NewRequestsTable
                  requests={filterRequests(pendingRequests)}
                  onViewDetails={setSelectedRequest}
                />
              </ScrollArea>
            </div>

            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filterRequests(pendingRequests)?.map((request) => (
                <NewRequestCard
                  key={request.id}
                  request={request}
                  onViewDetails={() => setSelectedRequest(request)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="approved">
            <div className="hidden md:block">
              <ScrollArea className="rounded-lg border h-[calc(100vh-300px)]">
                <NewRequestsTable
                  requests={filterRequests(approvedRequests)}
                  onViewDetails={setSelectedRequest}
                />
              </ScrollArea>
            </div>

            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filterRequests(approvedRequests)?.map((request) => (
                <NewRequestCard
                  key={request.id}
                  request={request}
                  onViewDetails={() => setSelectedRequest(request)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rejected">
            <div className="hidden md:block">
              <ScrollArea className="rounded-lg border h-[calc(100vh-300px)]">
                <NewRequestsTable
                  requests={filterRequests(rejectedRequests)}
                  onViewDetails={setSelectedRequest}
                  showApproveButton={true}
                />
              </ScrollArea>
            </div>

            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filterRequests(rejectedRequests)?.map((request) => (
                <NewRequestCard
                  key={request.id}
                  request={request}
                  onViewDetails={() => setSelectedRequest(request)}
                  showApproveButton={true}
                />
              ))}
            </div>
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