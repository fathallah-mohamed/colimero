import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";
import { ClientCard } from "@/components/admin/clients/ClientCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminClients() {
  const { data: clients, isLoading } = useQuery({
    queryKey: ['admin-clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          client_consents (
            consent_type_id,
            accepted,
            accepted_at
          )
        `);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-6 w-6 text-primary/70" />
        <h1 className="text-2xl font-bold">Liste des clients</h1>
      </div>

      <div className="grid gap-4">
        {clients?.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  );
}