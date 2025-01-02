import Navigation from "@/components/Navigation";
import { TourHeader } from "@/components/tour/TourHeader";
import { TourContent } from "@/components/tour/TourContent";

export default function MesTournees() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <TourHeader />
        <TourContent />
      </div>
    </div>
  );
}