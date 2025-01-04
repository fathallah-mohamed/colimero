import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import RequestDetailsDialog from "./RequestDetailsDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NewRequestCard } from "./new-requests/NewRequestCard";
import { NewRequestsTable } from "./new-requests/NewRequestsTable";
import Navigation from "@/components/Navigation";

export default function NewRegistrationRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const { data: requests, isLoading } = useQuery({
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

  const filteredRequests = requests?.filter(
    (request) =>
      request.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <div className="hidden md:block">
          <ScrollArea className="rounded-lg border h-[calc(100vh-300px)]">
            <NewRequestsTable
              requests={filteredRequests}
              onViewDetails={setSelectedRequest}
            />
          </ScrollArea>
        </div>

        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredRequests?.map((request) => (
            <NewRequestCard
              key={request.id}
              request={request}
              onViewDetails={() => setSelectedRequest(request)}
            />
          ))}
        </div>

        <RequestDetailsDialog
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      </div>
    </div>
  );
}