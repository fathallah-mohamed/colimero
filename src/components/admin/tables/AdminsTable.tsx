import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Admin {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

interface AdminsTableProps {
  admins: Admin[];
  onDeleteAdmin: (adminId: string, adminEmail: string) => void;
}

export function AdminsTable({ admins, onDeleteAdmin }: AdminsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Date de création</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {admins.map((admin) => (
          <TableRow key={admin.id}>
            <TableCell>{admin.first_name} {admin.last_name}</TableCell>
            <TableCell>{admin.email}</TableCell>
            <TableCell>{new Date(admin.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDeleteAdmin(admin.id, admin.email)}
                disabled={admin.email === 'admin@colimero.com'}
              >
                Supprimer
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}