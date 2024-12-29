"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJobs } from "../../services/jobServices";
import JobList from "../applications/JobList";
import { JobActionsProvider } from "../../store/JobActionsContext";
import LoadSpinner from "../common/LoadSpinner";

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

  if (error)
    return (
      <div className="text-red-500 text-center">
        Error: {error}
      </div>
    );

  return (
    <JobActionsProvider>
      <div className="employee-page bg-gray-100 min-h-screen p-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-black">
          All the Employee Jobs
        </h1>

        {/* Add Job button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleAddJobClick}
            className="bg-gradient-to-r from-orange-500 to-gray-700 text-white px-8 py-2 rounded-full shadow-lg hover:from-orange-600 hover:to-gray-800 transition duration-200"
          >
            Add Job
          </button>
        </div>

        {/* Job list */}
        {jobs.length > 0 ? (
          <JobList jobs={jobs} />
        ) : (
          <div className="text-center text-gray-600">No jobs available</div>
        )}
      </div>
    </JobActionsProvider>
  );
};

export default EmployeeDashboard;
