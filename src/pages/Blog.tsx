export default function Blog() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <div className="grid gap-8">
        <article className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Bientôt disponible</h2>
          <p className="text-gray-600">
            Notre blog est en cours de construction. Revenez bientôt pour découvrir nos articles !
          </p>
        </article>
      </div>
    </div>
  );
}