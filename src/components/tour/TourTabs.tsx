import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Globe, Lock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TourTabsProps {
  children: React.ReactNode;
  onTypeChange: (type: "public" | "private") => void;
}

export function TourTabs({ children, onTypeChange }: TourTabsProps) {
  return (
    <Tabs defaultValue="public" className="w-full" onValueChange={(value) => onTypeChange(value as "public" | "private")}>
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="public" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Tournées publiques
        </TabsTrigger>
        <TabsTrigger value="private" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Tournées privées
        </TabsTrigger>
      </TabsList>

      <Alert className="mb-6">
        <AlertDescription>
          <strong>Tournées publiques :</strong> Accessibles à tous les clients, réservation immédiate.
          <br />
          <strong>Tournées privées :</strong> Nécessitent l'approbation du transporteur pour chaque réservation.
        </AlertDescription>
      </Alert>

      <TabsContent value="public">
        {children}
      </TabsContent>
      <TabsContent value="private">
        {children}
      </TabsContent>
    </Tabs>
  );
}