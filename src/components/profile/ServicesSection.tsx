import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";
import { ServicesList } from "./services/ServicesList";
import { EditServicesDialog } from "./services/EditServicesDialog";
import { useServicesForm } from "./services/useServicesForm";

interface ServicesSectionProps {
  profile: any;
  onUpdate: () => void;
}

export function ServicesSection({ profile, onUpdate }: ServicesSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { form, onSubmit } = useServicesForm(profile, () => {
    setIsEditing(false);
    onUpdate();
  });

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Services proposés</h2>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setIsEditing(true)}
        >
          <Settings className="h-4 w-4" />
          Modifier
        </Button>
      </div>

      <ServicesList services={profile.carrier_services} />

      <EditServicesDialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        form={form}
        onSubmit={onSubmit}
      />
    </Card>
  );
}