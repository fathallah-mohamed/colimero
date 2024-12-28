import { Mail, Phone } from "lucide-react";

interface TransporteurContactProps {
  email: string;
  phone: string;
  phoneSecondary?: string;
}

export function TransporteurContact({ email, phone, phoneSecondary }: TransporteurContactProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Informations de contact</h2>
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
            <p className="text-gray-900">{phone}</p>
          </div>
        </div>
        {phoneSecondary && (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#E5DEFF] flex items-center justify-center">
              <Phone className="h-5 w-5 text-[#00B0F0]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Téléphone secondaire</p>
              <p className="text-gray-900">{phoneSecondary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}