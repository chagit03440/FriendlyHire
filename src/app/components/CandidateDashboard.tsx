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

  const { data: jobs = [], isLoading: isJobsLoading, error: jobsError } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });

  const { data: userApplications = [], isLoading: isApplicationsLoading, error: applicationsError } = useQuery({
    queryKey: ["userApplications", mail],
    queryFn: () => getUserApplications(mail),
    enabled: !!mail,
  });

  if (isJobsLoading || isApplicationsLoading) return <div>Loading...</div>;
  if (jobsError || applicationsError) return <div>Error loading data</div>;

  const filteredJobs = jobs.filter((job: IJob) =>
    !userApplications.some((app: IApplication) => app.jobId._id === job._id)
  );

  return (
    <JobActionsProvider>
      <div className="candidate-page">
        <h1 className="text-2xl font-bold mb-4">Available Jobs for Candidates</h1>
        {filteredJobs.length > 0 ? (
          <JobList jobs={filteredJobs} />
        ) : (
          <div>No jobs available</div>
        )}
      </div>
    </JobActionsProvider>
  );
};

export default CandidateDashboard;
