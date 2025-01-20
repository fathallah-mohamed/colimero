import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ApprovalRequestList } from "./ApprovalRequestList";

interface ApprovalRequestTabsProps {
  pendingRequests: any[];
  approvedRequests: any[];
  rejectedRequests: any[];
  userType: string | undefined;
  handleApproveRequest: (request: any) => void;
  handleRejectRequest: (request: any) => void;
  handleCancelRequest: (request: any) => void;
  handleDeleteRequest: (request: any) => void;
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
          <ApprovalRequestList
            requests={pendingRequests}
            userType={userType}
            showActions={true}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
            onCancel={handleCancelRequest}
            onDelete={handleDeleteRequest}
          />
        </ScrollArea>
      </TabsContent>

      <TabsContent value="approved">
        <ScrollArea className="h-[calc(100vh-300px)]">
          <ApprovalRequestList
            requests={approvedRequests}
            userType={userType}
            showActions={true}
          />
        </ScrollArea>
      </TabsContent>

      <TabsContent value="rejected">
        <ScrollArea className="h-[calc(100vh-300px)]">
          <ApprovalRequestList
            requests={rejectedRequests}
            userType={userType}
            showActions={true}
            onDelete={userType !== 'carrier' ? handleDeleteRequest : undefined}
          />
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}