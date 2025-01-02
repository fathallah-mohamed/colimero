import { BarChart3, Bell, HeadphonesIcon } from "lucide-react";

export function PlanningBenefits() {
  const benefits = [
    {
      icon: BarChart3,
      title: "Efficacité garantie",
      description: "Une plateforme conçue pour simplifier vos opérations"
    },
    {
      icon: Bell,
      title: "Flexibilité totale",
      description: "Adaptez vos tournées selon vos besoins"
    },
    {
      icon: HeadphonesIcon,
      title: "Soutien personnalisé",
      description: "Une équipe à votre disposition pour vous accompagner"
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir Colimero ?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center">
                <benefit.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}