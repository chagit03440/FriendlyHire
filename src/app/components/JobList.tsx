"use client";
import React from 'react';
import IJob from '../types/job';
import CandidateJobCard from './CandidateJobCard';
import JobCard from './JobCard';
import { useUser } from '../context/UserContext';

interface JobListProps {
  jobs: IJob[]; // Accept jobs as a prop
}

const JobList: React.FC<JobListProps> = ({ jobs }) => {
  const { role } = useUser(); // Access user role from context

  if (!jobs || jobs.length === 0) {
    return <div>No jobs available</div>; // Fallback if no jobs are provided
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {jobs.map((job) =>
          role === 'candidate' ? (
            <CandidateJobCard key={job._id} job={job} />
          ) : (
            <JobCard key={job._id} job={job} />
          )
        )}
      </div>
    </div>
  );
};

export default JobList;
