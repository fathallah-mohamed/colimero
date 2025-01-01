export interface ItemTables {
  prohibited_items: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    created_at: string;
  };

  service_templates: {
    id: string;
    service_type: string;
    description: string | null;
    icon: string;
    created_at: string;
    updated_at: string;
  };
}