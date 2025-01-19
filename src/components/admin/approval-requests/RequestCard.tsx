import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ApprovalRequest } from "./types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface RequestCardProps {
  request: ApprovalRequest;
  onClick: () => void;
}

export function RequestCard({ request, onClick }: RequestCardProps) {
  return (
    <Card 
      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">
            {request.client.first_name} {request.client.last_name}
          </h3>
          <p className="text-sm text-gray-600">{request.client.email}</p>
          <p className="text-sm text-gray-500 mt-2">
            {format(new Date(request.created_at), "d MMMM yyyy", { locale: fr })}
          </p>
        </div>
        <Badge variant={request.status === "pending" ? "outline" : "default"}>
          {request.status}
        </Badge>
      </div>
    </Card>
  );
}