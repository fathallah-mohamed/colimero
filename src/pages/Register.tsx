import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Register() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Inscription</h1>
        {/* Registration form will be added here */}
      </main>
      <Footer />
    </div>
  );
}