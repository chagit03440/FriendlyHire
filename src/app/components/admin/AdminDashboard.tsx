import React from "react";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const router = useRouter();

  const navigateToPage = (path: string) => {
    router.push(path); // Navigate to the specified path
  };

  return (
    <div className="bg-gray-100 text-black p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h1 className="text-3xl text-center font-semibold text-orange-500 mb-6">Admin Managment</h1>
      <div className="flex flex-col space-y-4">
        <button
          onClick={() => navigateToPage("home/admin/users")}
          className="bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Manage Users
        </button>
        <button
          onClick={() => navigateToPage("home/admin/applications")}
          className="bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Manage Applications
        </button>
        <button
          onClick={() => navigateToPage("home/admin/jobs")}
          className="bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Manage Jobs
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
