import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { TourBasicInfo } from "./TourBasicInfo";
import { TourDates } from "./TourDates";
import { TourCollectionPoints } from "./TourCollectionPoints";
import { Button } from "@/components/ui/button";

interface TourEditFormProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void;
  loading: boolean;
  onClose: () => void;
  isFormValid: boolean;
  tour: any;
}

export function TourEditForm({ form, onSubmit, loading, onClose, isFormValid, tour }: TourEditFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <TourBasicInfo form={form} tour={tour} />
          <TourDates form={form} tour={tour} />
          <TourCollectionPoints form={form} tour={tour} />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={loading || !isFormValid}
            className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white"
          >
            {loading ? "Mise à jour..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}