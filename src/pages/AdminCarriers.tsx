import CarriersList from "@/components/admin/carriers/CarriersList";

export default function AdminCarriers() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion des transporteurs</h1>
      <CarriersList />
    </div>
  );
}