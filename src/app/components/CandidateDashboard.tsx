"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getJobs } from '../services/jobServices';
import JobList from './JobList';

const CandidateDashboard: React.FC = () => {
  // Fetch jobs using react-query
  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: getJobs,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div className="candidate-page">
      <h1 className="text-2xl font-bold mb-4">Available Jobs for Candidates</h1>
      
      {jobs.length > 0 ? (
        <JobList jobs={jobs} />
      ) : (
        <div>No jobs available</div>
      )}
    </div>
  );
};

export default CandidateDashboard;
