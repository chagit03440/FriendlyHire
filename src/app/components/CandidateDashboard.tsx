"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getJobs } from '../services/jobServices';
import JobList from './JobList';
import { useUser } from "@/app/context/UserContext"; // Assuming you have a UserContext to access user email
import { getUserApplications } from '../services/applicationServices'; // Assuming you have a service to fetch applications
import IApplication from '../types/application';
import IJob from '../types/job';

const CandidateDashboard: React.FC = () => {
  const { mail } = useUser();  // Get the user's email from context

  // Fetch jobs using react-query
  const { data: jobs = [], isLoading: isJobsLoading, error: jobsError } = useQuery({
    queryKey: ['jobs'],
    queryFn: getJobs,
  });

  // Fetch user applications to filter jobs the user has applied for or saved
  const { data: userApplications = [], isLoading: isApplicationsLoading, error: applicationsError } = useQuery({
    queryKey: ['userApplications', mail],
    queryFn: () => getUserApplications(mail),
    enabled: !!mail, // Ensure query runs only if mail is available
  });

  if (isJobsLoading || isApplicationsLoading) return <div>Loading...</div>;
  if (jobsError || applicationsError) return <div>Error loading data</div>;

  // Filter out jobs the user has already applied for or saved (from the applications)
  const filteredJobs = jobs.filter((job:IJob) => {
    const isJobInApplications = userApplications.some((app:IApplication) => app.jobId.toString() === job._id);
    return !isJobInApplications; // Only include jobs not in the user's application list
  });

  return (
    <div className="candidate-page">
      <h1 className="text-2xl font-bold mb-4">Available Jobs for Candidates</h1>

      {filteredJobs.length > 0 ? (
        <JobList jobs={filteredJobs} />
      ) : (
        <div>No jobs available</div>
      )}
    </div>
  );
};

export default CandidateDashboard;
