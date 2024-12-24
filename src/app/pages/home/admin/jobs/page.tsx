"use client";
import JobList from "@/app/components/JobList";
import LoadSpinner from "@/app/components/common/LoadSpinner";
import { getJobs } from "@/app/services/jobServices";
import { JobActionsProvider } from "@/app/store/JobActionsContext";
import IJob from "@/app/types/job";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: jobs = [],
    isLoading,
    error,
  } = useQuery<IJob[]>({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });

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
  if (error instanceof Error) return <div>Error: {error.message}</div>;

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
