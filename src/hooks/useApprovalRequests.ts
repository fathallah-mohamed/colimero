import { useFetchRequests } from "./approval-requests/useFetchRequests";
import { useRequestActions } from "./approval-requests/useRequestActions";

export function useApprovalRequests(userType: string | null, userId: string | null) {
  const { requests, loading, error, fetchRequests } = useFetchRequests(userType, userId);
  const { 
    handleApproveRequest, 
    handleRejectRequest, 
    handleCancelRequest, 
    handleDeleteRequest 
  } = useRequestActions();

  const wrappedHandleApproveRequest = async (request: any) => {
    const result = await handleApproveRequest(request);
    if (result.success) {
      await fetchRequests();
    }
    return result;
  };

  const wrappedHandleRejectRequest = async (request: any) => {
    const result = await handleRejectRequest(request);
    if (result.success) {
      await fetchRequests();
    }
    return result;
  };

  const wrappedHandleCancelRequest = async (requestId: string) => {
    const result = await handleCancelRequest(requestId);
    if (result.success) {
      await fetchRequests();
    }
    return result;
  };

  const wrappedHandleDeleteRequest = async (requestId: string) => {
    const result = await handleDeleteRequest(requestId);
    if (result.success) {
      await fetchRequests();
    }
    return result;
  };

  return {
    requests,
    loading,
    error,
    handleApproveRequest: wrappedHandleApproveRequest,
    handleRejectRequest: wrappedHandleRejectRequest,
    handleCancelRequest: wrappedHandleCancelRequest,
    handleDeleteRequest: wrappedHandleDeleteRequest
  };
}