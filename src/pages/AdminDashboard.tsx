import { AdminsList } from "@/components/admin/AdminsList";
import ApprovedCarriers from "@/components/admin/ApprovedCarriers";
import NewRegistrationRequests from "@/components/admin/NewRegistrationRequests";
import RejectedRequests from "@/components/admin/RejectedRequests";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Demandes d'inscription</TabsTrigger>
          <TabsTrigger value="approved">Transporteurs approuvés</TabsTrigger>
          <TabsTrigger value="rejected">Demandes rejetées</TabsTrigger>
          <TabsTrigger value="admins">Administrateurs</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <NewRegistrationRequests />
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <ApprovedCarriers />
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <RejectedRequests />
        </TabsContent>

        <TabsContent value="admins" className="space-y-4">
          <AdminsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}