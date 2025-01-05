import Navigation from "@/components/Navigation";
import { TransporteurList } from "@/components/transporteur/TransporteurList";

export default function Transporteurs() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
        <h1 className="text-3xl font-bold mb-8">Nos transporteurs</h1>
        <TransporteurList />
      </div>
    </div>
  );
}