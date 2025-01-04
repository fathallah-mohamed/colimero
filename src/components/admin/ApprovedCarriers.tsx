import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CarrierSearchBar } from "./carriers/CarrierSearchBar";
import { CarrierTable } from "./carriers/CarrierTable";
import { CarrierDetailsDialog } from "./carriers/CarrierDetailsDialog";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ApprovedCarriers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CarrierSearchBar value={searchTerm} onChange={setSearchTerm} />
      
      <CarrierTable 
        carriers={filteredCarriers || []}
        onViewDetails={setSelectedCarrier}
        onSuspend={handleSuspendCarrier}
      />

      <CarrierDetailsDialog
        carrier={selectedCarrier}
        isOpen={!!selectedCarrier}
        onClose={() => setSelectedCarrier(null)}
      />
    </div>
  );
}
