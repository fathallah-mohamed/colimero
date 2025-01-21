import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ApprovalRequest } from "@/components/admin/approval-requests/types";
import { useFetchRequests } from "./approval-requests/useFetchRequests";
import { useRequestActions } from "./approval-requests/useRequestActions";

export function useApprovalRequests(userType: string | null, userId: string | null) {
  const { requests, loading, error, refetchRequests } = useFetchRequests(userType, userId);
  const { handleApproveRequest, handleRejectRequest, handleCancelRequest, handleDeleteRequest } = useRequestActions();

  return {
    requests,
    loading,
    error,
    handleApproveRequest,
    handleRejectRequest,
    handleCancelRequest,
    handleDeleteRequest,
    refetchRequests
  };
}