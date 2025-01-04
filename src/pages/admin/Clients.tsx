import { ClientsList } from "@/components/admin/clients/ClientsList";

export default function Clients() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion des clients</h1>
      <ClientsList />
    </div>
  );
}