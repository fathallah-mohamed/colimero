import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddAdminForm } from './forms/AddAdminForm';
import { AdminsTable } from './tables/AdminsTable';
import { useAdmins } from './hooks/useAdmins';

export function AdminsList() {
  const [open, setOpen] = useState(false);
  const { admins, loading, handleDeleteAdmin, fetchAdmins } = useAdmins();

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Liste des administrateurs</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Ajouter un administrateur</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un administrateur</DialogTitle>
            </DialogHeader>
            <AddAdminForm
              onSuccess={() => {
                setOpen(false);
                fetchAdmins();
              }}
              onCancel={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <AdminsTable
        admins={admins}
        onDeleteAdmin={handleDeleteAdmin}
      />

      {admins.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucun administrateur trouvé
        </div>
      )}
    </div>
  );
}