import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ApprovalRequest } from "@/components/admin/approval-requests/types";
import { useFetchRequests } from "./approval-requests/useFetchRequests";
import { useRequestActions } from "./approval-requests/useRequestActions";

export function useApprovalRequests(userType: string | null, userId: string | null) {
  const { requests, loading, error, refetchRequests } = useFetchRequests(userType, userId);
  const { handleApproveRequest, handleRejectRequest, handleCancelRequest, handleDeleteRequest } = useRequestActions();

  const handleRequestAction = async (actionType: string, request: ApprovalRequest) => {
    let success = false;
    
    switch (actionType) {
      case 'approve':
        success = (await handleApproveRequest(request)).success;
        break;
      case 'reject':
        success = (await handleRejectRequest(request)).success;
        break;
      case 'cancel':
        success = (await handleCancelRequest(request.id)).success;
        break;
      case 'delete':
        success = (await handleDeleteRequest(request.id)).success;
        break;
    }

    if (success) {
      await refetchRequests();
    }
  };

  return {
    requests,
    loading,
    error,
    handleApproveRequest: (request: ApprovalRequest) => handleRequestAction('approve', request),
    handleRejectRequest: (request: ApprovalRequest) => handleRequestAction('reject', request),
    handleCancelRequest: (requestId: string) => handleRequestAction('cancel', { id: requestId } as ApprovalRequest),
    handleDeleteRequest: (requestId: string) => handleRequestAction('delete', { id: requestId } as ApprovalRequest),
    refetchRequests
  };
}