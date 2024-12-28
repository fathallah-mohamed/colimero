import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TransporteurHeader } from "@/components/transporteur/TransporteurHeader";
import { TransporteurLayout } from "@/components/transporteur/TransporteurLayout";
import { TransporteurLeftColumn } from "@/components/transporteur/TransporteurLeftColumn";
import { TransporteurLoading } from "@/components/transporteur/TransporteurLoading";
import { TransporteurNotFound } from "@/components/transporteur/TransporteurNotFound";
import { TransporteurTours } from "@/components/transporteur/TransporteurTours";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ContactForm } from "@/components/transporteur/ContactForm";

export default function TransporteurDetails() {
  const { id } = useParams();

  const { data: transporteur, isLoading } = useQuery({
    queryKey: ["transporteur", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carriers")
        .select(`
          *,
          carrier_capacities!carrier_capacities_carrier_id_fkey (
            total_capacity,
            price_per_kg,
            offers_home_delivery
          ),
          carrier_services (
            id,
            service_type,
            description,
            icon
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const { data: publicTours } = useQuery({
    queryKey: ["transporteur-tours", id, "public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .eq("carrier_id", id)
        .eq("type", "public")
        .gte("departure_date", new Date().toISOString());

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: privateTours } = useQuery({
    queryKey: ["transporteur-tours", id, "private"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .eq("carrier_id", id)
        .eq("type", "private")
        .gte("departure_date", new Date().toISOString());

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <TransporteurLoading />;
  }

  if (!transporteur) {
    return <TransporteurNotFound />;
  }

  const transporteurName = transporteur.company_name || transporteur.first_name;

  return (
    <TransporteurLayout>
      <TransporteurHeader
        name={transporteur.company_name || ""}
        coverageArea={transporteur.coverage_area?.join(", ") || ""}
        avatarUrl={transporteur.avatar_url}
        firstName={transporteur.first_name}
      />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <TransporteurLeftColumn
          email={transporteur.email || ""}
          phone={transporteur.phone || ""}
          phoneSecondary={transporteur.phone_secondary}
          address={transporteur.address || ""}
          capacities={transporteur.carrier_capacities}
          services={transporteur.carrier_services}
          transporteurName={transporteurName}
        />
        <div className="grid md:grid-cols-2 gap-6">
          <TransporteurTours tours={publicTours || []} type="public" />
          <TransporteurTours tours={privateTours || []} type="private" />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="w-full max-w-md mx-auto block" size="lg">
              Contacter {transporteurName}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Contacter {transporteurName}</SheetTitle>
            </SheetHeader>
            <ContactForm 
              transporteurEmail={transporteur.email || ""} 
              transporteurName={transporteurName} 
            />
          </SheetContent>
        </Sheet>
      </div>
    </TransporteurLayout>
  );
}