import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Heading } from "@/components/ui/heading";

interface TransporteurHeaderProps {
  name: string;
  coverageArea: string;
  avatarUrl?: string;
  firstName?: string;
}

export function TransporteurHeader({ name, coverageArea, avatarUrl, firstName }: TransporteurHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-[#2563EB] to-[#00B0F0] py-16">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/nos-transporteurs" className="inline-flex items-center text-white mb-8 hover:opacity-80">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour aux transporteurs
        </Link>
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-white/10 flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-white">
                {firstName?.[0] || name[0]}
              </span>
            )}
          </div>
          <div>
            <Heading level={1} className="text-white mb-2">
              {name}
            </Heading>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Zone de couverture: {coverageArea}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}