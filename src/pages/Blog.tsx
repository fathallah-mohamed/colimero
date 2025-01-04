import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Newspaper } from "lucide-react";

const articles = [
  {
    title: "Expansion de nos services au Maghreb",
    date: "15 Mars 2024",
    summary: "Colimero étend sa présence avec de nouvelles routes vers l'Algérie et le Maroc.",
    image: "/placeholder.svg",
  },
  {
    title: "Nouveau système de suivi en temps réel",
    date: "10 Mars 2024",
    summary: "Suivez vos colis en temps réel grâce à notre nouvelle technologie de tracking.",
    image: "/placeholder.svg",
  },
  {
    title: "Partenariat avec les transporteurs locaux",
    date: "5 Mars 2024",
    summary: "Colimero renforce son réseau avec de nouveaux partenariats stratégiques.",
    image: "/placeholder.svg",
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-8">
            <Newspaper className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Actualités</h1>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <article key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">{article.date}</p>
                  <h2 className="text-xl font-semibold mb-3">{article.title}</h2>
                  <p className="text-gray-600">{article.summary}</p>
                  <button className="mt-4 text-primary hover:text-primary-hover font-medium">
                    Lire la suite →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}