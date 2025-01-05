import Navigation from "@/components/Navigation";
import { AdminsList } from "@/components/admin/AdminsList";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto py-8 pt-20">
        <AdminsList />
      </div>
    </div>
  );
}