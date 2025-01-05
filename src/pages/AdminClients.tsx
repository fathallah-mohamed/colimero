import Navigation from "@/components/Navigation";
import { ClientsList } from "@/components/admin/clients/ClientsList";

export default function AdminClients() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 pt-20">
        <ClientsList />
      </div>
    </div>
  );
}