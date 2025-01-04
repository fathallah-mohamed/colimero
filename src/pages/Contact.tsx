export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contactez-nous</h1>
      <div className="max-w-2xl mx-auto">
        <p className="text-gray-600 mb-8">
          Pour toute question ou demande d'information, n'hésitez pas à nous contacter.
        </p>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Email</h2>
            <p className="text-blue-600">contact@colimero.com</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Téléphone</h2>
            <p>+33 (0)1 23 45 67 89</p>
          </div>
        </div>
      </div>
    </div>
  );
}