import Navigation from "@/components/Navigation";
import { CreateTourForm } from "@/components/tour/CreateTourForm";

export default function PlanifierTournee() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">
          Planifier une nouvelle tournée
        </h1>
        <CreateTourForm />
      </div>
    </div>
  );
}