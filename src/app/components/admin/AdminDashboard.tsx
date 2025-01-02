import React from "react";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const router = useRouter();

  const navigateToPage = (path: string) => {
    router.push(path); // Navigate to the specified path
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col items-center pt-16 px-4">
      {/* Adjusted top padding and added horizontal padding */}
      <h1 className="text-2xl sm:text-4xl text-center font-bold text-gray-700 mb-8 sm:mb-14">
        Admin Management
      </h1>
      {/* Responsive text size and margin */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12">
        {/* Changed to grid layout for better responsiveness */}
        <button
          onClick={() => navigateToPage("home/admin/users")}
          className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center text-sm sm:text-lg"
        >
          Users
        </button>
        <button
          onClick={() => navigateToPage("home/admin/applications")}
          className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors shadow-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center text-sm sm:text-lg"
        >
          Applications
        </button>
        <button
          onClick={() => navigateToPage("home/admin/jobs")}
          className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 flex items-center justify-center text-sm sm:text-lg"
        >
          Jobs
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
