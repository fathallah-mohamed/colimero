import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import RequestDetailsDialog from "./RequestDetailsDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Filter, RefreshCw, Search, Settings } from "lucide-react";

export default function NewRegistrationRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const { data: requests, isLoading } = useQuery({
    queryKey: ["carrier-requests", statusFilter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carrier_registration_requests")
        .select("*")
        .eq("status", statusFilter)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredRequests = requests?.filter(
    (request) =>
      request.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <div className="w-full sm:w-auto">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Statut" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="approved">Validé</SelectItem>
              <SelectItem value="rejected">Rejeté</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="hidden md:block">
        <ScrollArea className="rounded-lg border h-[calc(100vh-300px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entreprise</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Date de demande</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests?.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.company_name}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.phone}</TableCell>
                  <TableCell>
                    {format(new Date(request.created_at), "dd MMMM yyyy", {
                      locale: fr,
                    })}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusBadgeClass(request.status)}`}>
                      {request.status === 'pending' ? 'En attente' : 
                       request.status === 'approved' ? 'Validé' : 'Rejeté'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedRequest(request)}
                      className="inline-flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Gérer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredRequests?.map((request) => (
          <Card key={request.id} className="p-4">
            <div className="space-y-2">
              <div className="font-medium">{request.company_name}</div>
              <div className="text-sm text-gray-500">{request.email}</div>
              <div className="text-sm">{request.phone}</div>
              <div className="text-sm text-gray-500">
                {format(new Date(request.created_at), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </div>
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusBadgeClass(request.status)}`}>
                  {request.status === 'pending' ? 'En attente' : 
                   request.status === 'approved' ? 'Validé' : 'Rejeté'}
                </span>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedRequest(request)}
                  className="w-full inline-flex items-center justify-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Gérer la demande
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <RequestDetailsDialog
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
}