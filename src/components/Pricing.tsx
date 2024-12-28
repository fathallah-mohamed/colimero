import { Button } from "@/components/ui/button";

const prices = [
  {
    name: "Petit colis",
    price: "29",
    description: "Jusqu'à 5kg",
    features: [
      "Livraison en 5-7 jours",
      "Suivi en ligne",
      "Assurance basique",
      "Support par email",
    ],
  },
  {
    name: "Colis standard",
    price: "49",
    description: "Jusqu'à 15kg",
    features: [
      "Livraison en 3-5 jours",
      "Suivi en temps réel",
      "Assurance premium",
      "Support prioritaire",
    ],
  },
  {
    name: "Grand colis",
    price: "89",
    description: "Jusqu'à 30kg",
    features: [
      "Livraison express",
      "Suivi détaillé",
      "Assurance complète",
      "Support 24/7",
    ],
  },
];

export default function Pricing() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Tarifs simples et transparents
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Des prix adaptés à tous vos besoins d'expédition
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {prices.map((tier) => (
            <div
              key={tier.name}
              className="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10"
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-semibold leading-8 text-gray-900">
                    {tier.name}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {tier.price}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">
                    €
                  </span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckCircle className="h-6 w-6 flex-none text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button className="mt-8" variant="default">
                Choisir cette offre
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}