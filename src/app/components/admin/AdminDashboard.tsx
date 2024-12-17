import React from "react";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const router = useRouter();

  const navigateToPage = (path: string) => {
    router.push(path); // Navigate to the specified path
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex flex-col space-y-4">
        <button
          onClick={() => navigateToPage("home/admin/users")}
          className="bg-blue-500 text-white p-4 rounded"
        >
          Manage Users
        </button>
        <button
          onClick={() => navigateToPage("home/admin/applications")}
          className="bg-green-500 text-white p-4 rounded"
        >
          Manage Applications
        </button>
        <button
          onClick={() => navigateToPage("home/admin/jobs")}
          className="bg-purple-500 text-white p-4 rounded"
        >
          Manage Jobs
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
