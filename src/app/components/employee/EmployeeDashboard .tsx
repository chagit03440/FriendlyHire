"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJobs } from "../../services/jobServices";
import JobList from "../jobs/JobList";
import { JobActionsProvider } from "../../store/JobActionsContext";
import LoadSpinner from "../common/LoadSpinner";
import { FaPlus } from "react-icons/fa"; // Import the add icon

const EmployeeDashboard = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState([]); // State to store job data
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null);

  // Fetch jobs in useEffect
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true); // Set loading state
      setError(null); // Reset error state
      try {
        const data = await getJobs(); // Call the API
        setJobs(data || []); // Update state with fetched data
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false); // Reset loading state
      }
    };

    fetchJobs(); // Trigger the function
  }, []); // Empty dependency array means it runs once on mount

  // Handle navigation to the Add Job page
  const handleAddJobClick = () => {
    router.push("/pages/home/employee/addJob");
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <LoadSpinner />
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <JobActionsProvider>
      <div className="employee-page bg-gray-100 min-h-screen p-8">
        {/* Wrapper for consistent width */}
        <div className="max-w-screen-lg mx-auto w-full">
          {/* Header with title and add icon */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-black">Your Jobs</h1>

            {/* Add Job button */}
            <button
              onClick={handleAddJobClick}
              className="bg-orange-400 text-white p-3 rounded-full shadow-md hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
              title="Post a New Job"
            >
              <FaPlus size={24} /> {/* Add icon */}
            </button>
          </div>

          {/* Job list */}
          <div className="space-y-6">
            {jobs.length > 0 ? (
              <JobList jobs={jobs} />
            ) : (
              <div className="text-center text-gray-600">No jobs available</div>
            )}
          </div>
        </div>
      </div>
    </JobActionsProvider>
  );
};

export default EmployeeDashboard;
