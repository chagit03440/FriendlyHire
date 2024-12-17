"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../services/jobServices";
import JobList from "./JobList";
import { useUser } from "../store/UserContext";
import IJob from "../types/job";
import { JobActionsProvider } from "../store/JobActionsContext";

const EmployeeDashboard = () => {
  const router = useRouter(); // Initialize useRouter
  const { mail, role } = useUser(); // Get the current user's email and role

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

  // Navigate to the Add Job page
  const handleAddJobClick = () => {
    router.push("/pages/home/employee/addJob"); // Navigate to the Add Job page
  };

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <JobActionsProvider>
      <div className="employee-page">
        <h1 className="text-2xl font-bold mb-4">All the Employee Jobs</h1>

        {/* Add Job button */}
        <button
          onClick={handleAddJobClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 mb-4"
        >
          Add Job
        </button>

        {/* Job list */}
        {filteredJobs.length > 0 ? (
          <JobList jobs={filteredJobs} /> // Pass the filtered jobs to JobList
        ) : (
          <div>No jobs available</div> // Fallback for no jobs
        )}
      </div>
    </JobActionsProvider>
  );
};

export default EmployeeDashboard;
