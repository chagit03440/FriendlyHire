"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../services/jobServices";
import JobList from "./JobList";
import { useUser } from "@/app/store/UserContext";
import { getUserApplications } from "../services/applicationServices";
import { JobActionsProvider } from "@/app/store/JobActionsContext";
import IJob from "../types/job";
import IApplication from "../types/application";

const CandidateDashboard: React.FC = () => {
  const { mail } = useUser();

  // Fetch all jobs using react-query
  const {
    data: jobs = [],
    isLoading: isJobsLoading,
    error: jobsError,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });

  // Fetch user applications using react-query
  const {
    data: userApplications = [],
    isLoading: isApplicationsLoading,
    error: applicationsError,
  } = useQuery({
    queryKey: ["userApplications", mail],
    queryFn: () => getUserApplications(mail),
    enabled: !!mail,
  });

  // Handle loading and error states
  if (isJobsLoading || isApplicationsLoading) return <div>Loading...</div>;
  if (jobsError || applicationsError) return <div>Error loading data</div>;

  // Filter out jobs that the user has already applied for
  const filteredJobs = jobs.filter(
    (job: IJob) =>
      !userApplications.some((app: IApplication) => app.jobId._id === job._id)
  );

  return (
    <JobActionsProvider>
      <div className="candidate-page bg-gray-100 min-h-screen p-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-800">
          Available Jobs for Candidates
        </h1>

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

export default CandidateDashboard;
