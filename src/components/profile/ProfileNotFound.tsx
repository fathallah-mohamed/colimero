export function ProfileNotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Profil non trouvé</h2>
        <p className="mt-2 text-gray-600">
          Nous n'avons pas pu trouver votre profil. Veuillez vous reconnecter.
        </p>
      </div>
    </div>
  );
}