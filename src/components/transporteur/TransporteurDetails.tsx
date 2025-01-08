import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TransporteurHeader } from "./TransporteurHeader";
import { TransporteurServices } from "./TransporteurServices";
import { TransporteurCapacities } from "./TransporteurCapacities";
import { TransporteurTours } from "./TransporteurTours";
import { TransporteurContact } from "./TransporteurContact";
import { TransporteurNotFound } from "./TransporteurNotFound";
import { TransporteurLoading } from "./TransporteurLoading";
import Navigation from "@/components/Navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TransporteurDetails() {
  const [carrier, setCarrier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarrier = async () => {
      try {
        const { data, error } = await supabase
          .from("carriers")
          .select(`
            *,
            carrier_services(*),
            carrier_capacities(*),
            tours(*)
          `)
          .eq("id", id)
          .single();

        if (error) throw error;
        setCarrier(data);
      } catch (error) {
        console.error("Error fetching carrier:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCarrier();
    }
  }, [id]);

  if (loading) {
    return <TransporteurLoading />;
  }

  if (!carrier) {
    return <TransporteurNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          onClick={() => navigate('/transporteurs')}
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux transporteurs
        </Button>

        <TransporteurHeader
          name={carrier.company_name}
          coverageArea={carrier.coverage_area?.join(", ")}
          avatarUrl={carrier.avatar_url}
          firstName={carrier.first_name}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <TransporteurContact
              email={carrier.email}
              phone={carrier.phone}
              phoneSecondary={carrier.phone_secondary}
              address={carrier.address}
            />
            <TransporteurServices services={carrier.carrier_services} />
            <TransporteurTours tours={carrier.tours} />
          </div>
          <div className="space-y-8">
            <TransporteurCapacities capacities={carrier.carrier_capacities?.[0]} />
          </div>
        </div>
      </div>
    </div>
  );
}