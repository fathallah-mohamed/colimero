import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ShareTourButtonProps {
  tourId: number;
  className?: string;
}

export function ShareTourButton({ tourId, className }: ShareTourButtonProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    const tourUrl = `${window.location.origin}/tours/${tourId}`;

    try {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Partager la tournée',
            text: 'Consultez cette tournée',
            url: tourUrl,
          });
        } catch (shareError) {
          // Si le partage natif échoue, on replie sur la copie du lien
          await navigator.clipboard.writeText(tourUrl);
          toast({
            title: "Lien copié !",
            description: "Le lien de la tournée a été copié dans votre presse-papiers",
          });
        }
      } else {
        // Pas de partage natif disponible, on copie directement le lien
        await navigator.clipboard.writeText(tourUrl);
        toast({
          title: "Lien copié !",
          description: "Le lien de la tournée a été copié dans votre presse-papiers",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de partager la tournée",
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={handleShare}
    >
      <Share2 className="h-4 w-4 mr-2" />
      Partager
    </Button>
  );
}