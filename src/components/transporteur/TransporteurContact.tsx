import { Mail, MapPin, Phone } from "lucide-react";

interface TransporteurContactProps {
  email: string;
  phone: string;
  phoneSecondary?: string | null;
  address: string;
}

export function TransporteurContact({
  email,
  phone,
  phoneSecondary,
  address,
}: TransporteurContactProps) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Contact</h3>
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <a 
              href={`mailto:${email}`}
              className="text-gray-900 hover:text-[#00B0F0] transition-colors"
            >
              {email}
            </a>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Téléphone</p>
            <a 
              href={`tel:${phone}`}
              className="text-gray-900 hover:text-[#00B0F0] transition-colors"
            >
              {phone}
            </a>
            {phoneSecondary && (
              <a 
                href={`tel:${phoneSecondary}`}
                className="block text-gray-900 hover:text-[#00B0F0] transition-colors"
              >
                {phoneSecondary}
              </a>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Adresse</p>
            <a 
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 hover:text-[#00B0F0] transition-colors"
            >
              {address}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}