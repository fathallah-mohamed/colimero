import { useApprovalRequests } from "@/hooks/useApprovalRequests";
import { ApprovalRequestCard } from "./ApprovalRequestCard";
import { Loader2, AlertCircle } from "lucide-react";

export function ApprovalRequestsList() {
  const { requests, loading, handleCancelRequest } = useApprovalRequests();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!requests?.length) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucune demande d'approbation
        </h3>
        <p className="text-gray-500">
          Vous n'avez pas encore fait de demande d'approbation pour des tournées privées.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {requests.map((request) => (
        <ApprovalRequestCard
          key={request.id}
          request={request}
          userType="client"
          onCancel={handleCancelRequest}
        />
      ))}
    </div>
  );
}