import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ApprovedCarrierCard } from "./approved-carriers/ApprovedCarrierCard";
import { ApprovedCarriersTable } from "./approved-carriers/ApprovedCarriersTable";
import Navigation from "@/components/Navigation";
import ApprovedCarrierDetails from "./approved-carriers/ApprovedCarrierDetails";

export default function ApprovedCarriers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);

  const { data: carriers, isLoading } = useQuery({
    queryKey: ["carrier-requests", "approved"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carriers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredCarriers = carriers?.filter(
    (carrier) =>
      carrier.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carrier.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            <ApprovedCarriersTable
              carriers={filteredCarriers}
              onViewDetails={setSelectedCarrier}
            />
          </ScrollArea>
        </div>

        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredCarriers?.map((carrier) => (
            <ApprovedCarrierCard
              key={carrier.id}
              carrier={carrier}
              onViewDetails={() => setSelectedCarrier(carrier)}
            />
          ))}
        </div>

        <ApprovedCarrierDetails
          carrier={selectedCarrier}
          onClose={() => setSelectedCarrier(null)}
        />
      </div>
    </div>
  );
}