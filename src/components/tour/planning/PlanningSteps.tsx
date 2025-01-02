export function PlanningSteps() {
  const steps = [
    {
      title: "Créez votre tournée",
      description: "Indiquez vos trajets, vos lieux de collecte et vos dates"
    },
    {
      title: "Recevez des demandes",
      description: "Consultez et acceptez les demandes d'expédition des expéditeurs"
    },
    {
      title: "Optimisez votre capacité",
      description: "Remplissez votre véhicule pour rentabiliser chaque trajet"
    },
    {
      title: "Repartez rapidement",
      description: "Planifiez vos trajets retour pour réduire votre temps d'attente"
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Comment ça fonctionne ?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}