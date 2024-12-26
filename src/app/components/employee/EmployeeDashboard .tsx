"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../../services/jobServices";
import JobList from "../applications/JobList";
import { useUser } from "../../store/UserContext";
import IJob from "../../types/job";
import { JobActionsProvider } from "../../store/JobActionsContext";
import LoadSpinner from "../common/LoadSpinner";

const EmployeeDashboard = () => {
  const router = useRouter();
  const { mail, role } = useUser();

  // Fetch all jobs using react-query
  const {
    data: jobs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });

 
  // Filter jobs based on the employee's email
  const filteredJobs =
    role === "employee"
      ? jobs.filter((job: IJob) => job.createdBy === mail)
      : [];

  // Handle navigation to the Add Job page
  const handleAddJobClick = () => {
    router.push("/pages/home/employee/addJob");
  };

  // Render loading state
  if (isLoading)
    return (
      <div>
        <LoadSpinner />
      </div>
    );

  // Render error state
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <JobActionsProvider>
      <div className="employee-page bg-gray-100 min-h-screen p-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-800">
          All the Employee Jobs
        </h1>

        {/* Add Job button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleAddJobClick}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-2 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-600 transition duration-200"
          >
            Add Job
          </button>
        </div>

        {/* Job list */}
        {filteredJobs.length > 0 ? (
          <JobList jobs={filteredJobs} />
        ) : (
          <div className="text-center text-gray-600">No jobs available</div>
        )}
      </div>
    </JobActionsProvider>
  );
};

export default EmployeeDashboard;
