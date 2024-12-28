import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      content: "Service exceptionnel ! Mon colis est arrivé en parfait état et dans les délais prévus.",
      author: "Sophie Martin",
      location: "Paris, France",
      rating: 5,
    },
    {
      content: "Une plateforme qui simplifie vraiment l'envoi de colis entre la France et la Tunisie.",
      author: "Ahmed Ben Ali",
      location: "Tunis, Tunisie",
      rating: 5,
    },
    {
      content: "En tant que transporteur, j'apprécie la simplicité d'utilisation et la fiabilité du service.",
      author: "Jean Dupont",
      location: "Marseille, France",
      rating: 5,
    },
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Ce qu'en disent nos utilisateurs
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="text-center p-6">
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">{testimonial.content}</p>
              <p className="font-semibold">{testimonial.author}</p>
              <p className="text-sm text-gray-500">{testimonial.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}