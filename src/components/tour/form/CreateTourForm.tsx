import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { tourFormSchema, type TourFormValues } from "./schema";

interface CreateTourFormProps {
  onSuccess: () => void;
}

export default function CreateTourForm({ onSuccess }: CreateTourFormProps) {
  const { toast } = useToast();
  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      location: "",
      capacity: 0,
      price: 0,
    },
  });

  const handleSubmit = async (values: TourFormValues) => {
    try {
      // Logic to create a tour
      // For example, you might send a request to your API here

      onSuccess();
    } catch (error) {
      console.error("Error creating tour:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la tournée",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Form fields go here */}
        <Button type="submit" className="w-full">
          Créer la tournée
        </Button>
      </form>
    </Form>
  );
}
