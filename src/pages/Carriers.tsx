import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Carriers() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Nos transporteurs</h1>
        {/* Carriers list will be added here */}
      </main>
      <Footer />
    </div>
  );
}