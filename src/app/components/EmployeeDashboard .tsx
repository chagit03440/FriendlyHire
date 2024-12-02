import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import JobList from './JobList';

const EmployeeDashboard = () => {
  const router = useRouter(); // Initialize useRouter

  const handleAddJobClick = () => {
    router.push('/pages/home/addJob'); // Navigate to the Add Job page
  };

  return (
    <div className="employee-page">
      <h1 className="text-2xl font-bold">Available Jobs for Employees</h1>
      
      {/* Add Job button */}
      <button 
        onClick={handleAddJobClick}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
      >
        Add Job
      </button>

      {/* Job list */}
      <JobList userRole="employee" />
    </div>
  );
};

export default EmployeeDashboard;
