"use client";
import JobList from "@/app/components/jobs/JobList";
import LoadSpinner from "@/app/components/common/LoadSpinner";
import { getJobs } from "@/app/services/jobServices";
import { JobActionsProvider } from "@/app/store/JobActionsContext";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

const Page = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [jobs, setJobs] = useState([]); // State to store job data
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null);

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

  const handleAddJob = async () => {
    router.push("/pages/home/employee/addJob"); // Navigate to the Add Job page
    await queryClient.invalidateQueries({ queryKey: ["applications"] });
  };

  if (isLoading)
    return (
      <div>
        <LoadSpinner />
      </div>
    );
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <JobActionsProvider>
      {/* Wrapper with consistent width */}
      <div className="max-w-5xl mx-auto">
        {/* Header and button */}
        <div className="flex justify-between items-center mt-6 mb-6 px-4">
          <h2 className="text-3xl font-semibold text-black">Jobs Data</h2>
          <button
            onClick={handleAddJob}
            className="bg-orange-400 text-white p-3 rounded-full shadow-md hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
            title="Add a New Job"
          >
            <FaPlus size={24} />
          </button>
        </div>
        {/* Job List */}
        <div className="px-4">
          <JobList jobs={jobs} />
        </div>
      </div>
    </JobActionsProvider>
  );
};

export default Page;
