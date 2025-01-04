import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const articles = [
  {
    id: 1,
    title: "Comment bien emballer vos colis pour l'expédition",
    excerpt: "Découvrez nos conseils d'experts pour protéger vos colis lors du transport...",
    date: "2024-01-15",
    category: "Conseils",
    imageUrl: "https://images.unsplash.com/photo-1605164599901-db7f68c4b175?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: 2,
    title: "Les documents nécessaires pour l'export vers le Maghreb",
    excerpt: "Guide complet des formalités douanières et documents requis...",
    date: "2024-01-10",
    category: "Réglementation",
    imageUrl: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: 3,
    title: "Optimiser vos coûts d'expédition",
    excerpt: "Astuces et conseils pour réduire vos frais de transport...",
    date: "2024-01-05",
    category: "Économie",
    imageUrl: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blog Colimero
          </h1>
          <p className="text-lg text-gray-600">
            Actualités, conseils et informations sur l'expédition de colis
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-600 font-medium">
                    {article.category}
                  </span>
                  <time className="text-sm text-gray-500">
                    {new Date(article.date).toLocaleDateString('fr-FR')}
                  </time>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {article.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {article.excerpt}
                </p>
                <Button asChild variant="outline">
                  <Link to={`/blog/${article.id}`}>
                    Lire la suite
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}