export default function Footer() {
  return (
    <footer className="bg-primary">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-300">
            &copy; 2024 Colimero. Tous droits réservés.
          </p>
        </div>
        <div className="flex justify-center space-x-10 md:order-2">
          <a href="#" className="text-gray-300 hover:text-white">
            Mentions légales
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            CGV
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}