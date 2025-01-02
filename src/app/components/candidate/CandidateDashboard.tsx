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
import { getUser } from "@/app/services/userServices";
import { useRouter } from "next/navigation";

const hasSkills = async (mail: string | null) => {
  if (mail) {
    const user = await getUser(mail);
    return user.skills && user.skills.length > 0;
  }
  return false;
};

const CandidateDashboard: React.FC = () => {
  const { mail } = useUser();
  const router = useRouter();
  const [jobs, setJobs] = useState([]); // State to store job data
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null);
  const [userHasSkills, setUserHasSkills] = useState<boolean>(true);

  // Check if user has skills
  useEffect(() => {
    const checkSkills = async () => {
      if (mail) {
        const skills = await hasSkills(mail);
        setUserHasSkills(skills);
      }
    };
    checkSkills();
  }, [mail]);

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
        <h1 className="text-4xl font-bold mb-6 text-center text-black">
          Jobs for you
        </h1>

        {/* Conditional message */}
        {!userHasSkills && (
          <div className="text-center mb-6">
            <p className="text-gray-700 mb-4">
              It seems like you haven &apos; t set up your profile yet. Jobs&apos;
              aren&apost specifically matched to you right now.
            </p>
            <button
              onClick={() => router.push("/pages/home/profile")}
              className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-300"
            >
              Complete Your Profile
            </button>
          </div>
        )}

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
