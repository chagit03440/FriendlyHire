"use client";
import JobList from "@/app/components/jobs/JobList";
import LoadSpinner from "@/app/components/common/LoadSpinner";
import { getJobs } from "@/app/services/jobServices";
import { JobActionsProvider } from "@/app/store/JobActionsContext";
// import { useUser } from "@/app/store/UserContext";
// import IJob from "@/app/types/job";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
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
      <h2 className="text-xl font-semibold mb-4">Jobs Data</h2>
      {/* Add Job Button */}
      <div className="mb-6">
        <button
          onClick={handleAddJob}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Job
        </button>
      </div>
      <div>
        <JobList jobs={jobs} />
      </div>
    </JobActionsProvider>
  );
};

export default Page;
