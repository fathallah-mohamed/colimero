import Navigation from "@/components/Navigation";
import { TransporteurList } from "@/components/transporteur/TransporteurList";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function Transporteurs() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
          <h1 className="text-3xl font-bold mb-8">Nos transporteurs</h1>
          <TransporteurList />
        </div>
      </Suspense>
    </div>
  );
}