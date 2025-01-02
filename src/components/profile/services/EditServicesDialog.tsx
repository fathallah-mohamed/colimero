import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ServiceOptions } from "@/components/auth/ServiceOptions";
import { UseFormReturn } from "react-hook-form";

interface EditServicesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<any>;
  onSubmit: (values: any) => Promise<void>;
}

export function EditServicesDialog({ isOpen, onClose, form, onSubmit }: EditServicesDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary">
            Modifier mes services
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ServiceOptions form={form} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                Enregistrer
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}