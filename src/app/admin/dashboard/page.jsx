import Sidebar from "@/components/admin/Sidebar";
import Dashboard from "./Dashboard";

export default function Page() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 px-4 pt-15 md:p-6">
        <Dashboard />
      </main>
    </div>
  );
}