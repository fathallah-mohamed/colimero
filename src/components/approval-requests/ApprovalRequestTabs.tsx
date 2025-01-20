import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ApprovalRequestCard } from "./ApprovalRequestCard";
import { ApprovalRequest } from "@/components/admin/approval-requests/types";

interface ApprovalRequestTabsProps {
  pendingRequests: ApprovalRequest[];
  approvedRequests: ApprovalRequest[];
  rejectedRequests: ApprovalRequest[];
  userType: string | undefined;
  handleApproveRequest: (request: ApprovalRequest) => void;
  handleRejectRequest: (request: ApprovalRequest) => void;
  handleCancelRequest: (request: string) => void;
  handleDeleteRequest: (request: string) => void;
}

export function ApprovalRequestTabs({
  pendingRequests,
  approvedRequests,
  rejectedRequests,
  userType,
  handleApproveRequest,
  handleRejectRequest,
  handleCancelRequest,
  handleDeleteRequest
}: ApprovalRequestTabsProps) {
  const renderRequests = (requests: ApprovalRequest[], showActions: boolean = false) => {
    if (!requests || requests.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          Aucune demande
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {requests.map(request => (
          <ApprovalRequestCard
            key={request.id}
            request={request}
            userType={userType}
            showActions={showActions}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
            onCancel={handleCancelRequest}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>
    );
  };

  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="mb-8">
        <TabsTrigger value="pending">
          En attente ({pendingRequests.length})
        </TabsTrigger>
        <TabsTrigger value="approved">
          Validées ({approvedRequests.length})
        </TabsTrigger>
        <TabsTrigger value="rejected">
          Refusées ({rejectedRequests.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        <ScrollArea className="h-[calc(100vh-300px)]">
          {renderRequests(pendingRequests, true)}
        </ScrollArea>
      </TabsContent>

      <TabsContent value="approved">
        <ScrollArea className="h-[calc(100vh-300px)]">
          {renderRequests(approvedRequests)}
        </ScrollArea>
      </TabsContent>

      <TabsContent value="rejected">
        <ScrollArea className="h-[calc(100vh-300px)]">
          {renderRequests(rejectedRequests)}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}