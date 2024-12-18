"use client";
import JobList from '@/app/components/JobList'
import { getJobs } from '@/app/services/jobServices';
import { JobActionsProvider } from '@/app/store/JobActionsContext';
import IJob from '@/app/types/job';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react'

const page = () => {

  const router = useRouter();
  const queryClient = useQueryClient();

    const { data: jobs = [], isLoading, error } = useQuery<IJob[]>({
      queryKey: ["jobs"],
      queryFn: getJobs,
  });

  const handleAddJob = () => {
    router.push("/pages/home/employee/addJob"); // Navigate to the Add Job page
};

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <JobActionsProvider>
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
        <JobList jobs={jobs}/>
      </div>
    </JobActionsProvider>
  )
}

export default page
