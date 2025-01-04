import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ApprovedCarrierCard } from "./approved-carriers/ApprovedCarrierCard";
import { ApprovedCarrierDetails } from "./approved-carriers/ApprovedCarrierDetails";
import { ApprovedCarriersTable } from "./approved-carriers/ApprovedCarriersTable";

export default function ApprovedCarriers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: carriers, isLoading } = useQuery({
    queryKey: ["approved-carriers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carriers")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleSuspendCarrier = async (carrierId: string) => {
    try {
      const { error: updateError } = await supabase
        .from("carriers")
        .update({ status: "suspended" })
        .eq("id", carrierId);

      if (updateError) throw updateError;

      const { data: carrier, error: carrierError } = await supabase
        .from("carriers")
        .select("*")
        .eq("id", carrierId)
        .single();

      if (carrierError) throw carrierError;

      const { data: existingRequest, error: checkError } = await supabase
        .from("carrier_registration_requests")
        .select("id")
        .eq("email", carrier.email)
        .eq("status", "rejected")
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (!existingRequest) {
        const { error: requestError } = await supabase
          .from("carrier_registration_requests")
          .insert([{
            email: carrier.email,
            first_name: carrier.first_name,
            last_name: carrier.last_name,
            company_name: carrier.company_name,
            siret: carrier.siret,
            phone: carrier.phone,
            phone_secondary: carrier.phone_secondary,
            address: carrier.address,
            coverage_area: carrier.coverage_area,
            status: "rejected",
            reason: "Compte suspendu par un administrateur",
            avatar_url: carrier.avatar_url,
          }]);

        if (requestError) throw requestError;
      }

      await queryClient.invalidateQueries({ queryKey: ["approved-carriers"] });
      await queryClient.invalidateQueries({ queryKey: ["rejected-requests"] });

      toast({
        title: "Transporteur suspendu",
        description: "Le compte du transporteur a été suspendu avec succès.",
      });
    } catch (error: any) {
      console.error("Error suspending carrier:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de suspendre le transporteur.",
      });
    }
  };

  const filteredCarriers = carriers?.filter(
    (carrier) =>
      carrier.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carrier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
            onSuspend={handleSuspendCarrier}
          />
        </ScrollArea>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredCarriers?.map((carrier) => (
          <ApprovedCarrierCard
            key={carrier.id}
            carrier={carrier}
            onViewDetails={() => setSelectedCarrier(carrier)}
            onSuspend={() => handleSuspendCarrier(carrier.id)}
          />
        ))}
      </div>

      <ApprovedCarrierDetails
        carrier={selectedCarrier}
        open={!!selectedCarrier}
        onClose={() => setSelectedCarrier(null)}
      />
    </div>
  );
}