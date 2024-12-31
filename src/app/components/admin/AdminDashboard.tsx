import React from "react";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const router = useRouter();

  const navigateToPage = (path: string) => {
    router.push(path); // Navigate to the specified path
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col items-center pt-20">
      {/* Reduced top padding */}
      <h1 className="text-4xl text-center font-bold text-gray-700 mb-14">
        Admin Management
      </h1>
      {/* Reduced margin below the header */}
      <div className="flex justify-center space-x-12">
        <button
          onClick={() => navigateToPage("home/admin/users")}
          className="w-32 h-32 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center text-xl"
        >
          Users
        </button>
        <button
          onClick={() => navigateToPage("home/admin/applications")}
          className="w-32 h-32 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors shadow-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center text-xl"
        >
          Applications
        </button>
        <button
          onClick={() => navigateToPage("home/admin/jobs")}
          className="w-32 h-32 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 flex items-center justify-center text-xl"
        >
          Jobs
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
