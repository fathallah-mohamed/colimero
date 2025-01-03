import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { tourFormSchema } from "./schema";
import { FormHeader } from "./FormHeader";
import { FormSections } from "./FormSections";
import { FormSubmitButton } from "./FormSubmitButton";
import type { TourFormValues } from "./types";

export default function CreateTourForm() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      departure_country: "FR",
      destination_country: "TN",
      total_capacity: 1000,
      remaining_capacity: 1000,
      type: "public",
      departure_date: new Date(),
      terms_accepted: false,
      customs_declaration: false,
      route: [
        {
          name: "",
          location: "",
          time: "",
          type: "pickup",
          collection_date: new Date().toISOString().split('T')[0],
        },
      ],
    },
  });

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormHeader />
            <FormSections form={form} />
            <FormSubmitButton form={form} />
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
}