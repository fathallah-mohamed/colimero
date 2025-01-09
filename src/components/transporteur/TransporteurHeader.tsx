import { MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { TransporteurAvatar } from "./TransporteurAvatar";

interface TransporteurHeaderProps {
  name: string;
  coverageArea: string[];
  avatarUrl?: string | null;
  firstName?: string;
}

const countryNames: { [key: string]: string } = {
  'FR': 'FR',
  'TN': 'TN',
  'MA': 'MA',
  'DZ': 'DZ'
};

export function TransporteurHeader({ name, coverageArea, avatarUrl }: TransporteurHeaderProps) {
  const navigate = useNavigate();
  
  const formatCoverageArea = (countries: string[]) => {
    return countries.map(code => countryNames[code] || code)
      .join(" ↔ ");
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-400 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <button 
          onClick={() => navigate('/transporteurs')}
          className="inline-flex items-center text-white mb-8 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour aux transporteurs
        </button>
        <div className="flex items-center gap-6">
          <TransporteurAvatar
            avatarUrl={avatarUrl}
            companyName={name}
            size="lg"
          />
          <div>
            <Heading level={1} className="text-white mb-2">
              {name}
            </Heading>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Zone de couverture : {formatCoverageArea(coverageArea)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}