import { Mail, Phone, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TransporteurContactProps {
  email: string;
  phone: string;
  phoneSecondary?: string | null;
  address?: string;
}

export function TransporteurContact({ email, phone, phoneSecondary, address }: TransporteurContactProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Contact</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#E5DEFF] flex items-center justify-center">
            <Mail className="h-5 w-5 text-[#00B0F0]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-900">{email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#E5DEFF] flex items-center justify-center">
            <Phone className="h-5 w-5 text-[#00B0F0]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Téléphone</p>
            <a href={`tel:${phone}`} className="text-gray-900 hover:text-[#00B0F0] transition-colors">
              {phone}
            </a>
            {phoneSecondary && (
              <a href={`tel:${phoneSecondary}`} className="block text-gray-600 text-sm hover:text-[#00B0F0] transition-colors">
                {phoneSecondary}
              </a>
            )}
          </div>
        </div>

        {address && (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#E5DEFF] flex items-center justify-center">
              <MapPin className="h-5 w-5 text-[#00B0F0]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Adresse</p>
              <p className="text-gray-900">{address}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}