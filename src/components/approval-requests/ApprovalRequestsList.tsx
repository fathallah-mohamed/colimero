import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ApprovalRequestCard } from "./ApprovalRequestCard";

export function ApprovalRequestsList() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const { data: requests, isLoading } = useQuery({
    queryKey: ['approval-requests', page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('approval_requests')
        .select(`
          *,
          tours (
            *,
            carrier:carriers (*)
          )
        `)
        .range((page - 1) * pageSize, page * pageSize - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      {requests?.map((request) => (
        <ApprovalRequestCard 
          key={request.id} 
          request={request} 
          userType="client"
        />
      ))}
    </div>
  );
}