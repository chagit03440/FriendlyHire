"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../../services/jobServices";
import JobList from "../jobs/JobList";
import { useUser } from "@/app/store/UserContext";
import { getUserApplications } from "../../services/applicationServices";
import { JobActionsProvider } from "@/app/store/JobActionsContext";
import IJob from "../../types/job";
import IApplication from "../../types/application";
import LoadSpinner from "../common/LoadSpinner";

const CandidateDashboard: React.FC = () => {
  const { mail } = useUser();

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

  if (isLoading || isApplicationsLoading)
    return (
      <div>
        <LoadSpinner />
      </div>
    );
  if (error || applicationsError)
    return <div className="text-red-500">Error: {error}</div>;

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
