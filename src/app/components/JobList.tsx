import React from 'react';
import IJob from '../types/job';
import { useQuery } from '@tanstack/react-query';
import JobCard from './JobCard';
import CandidateJobCard from './CandidateJobCard';

const getAllJobs = async (): Promise<IJob[]> => {
  const response = await fetch('/api/jobs'); // Adjust the endpoint accordingly
  const data = await response.json();
  return data;
};

interface JobListProps {
  userRole: 'candidate' | 'employee';  // Pass user role as a prop
}

const JobList: React.FC<JobListProps> = ({ userRole }) => {
  const { data: jobs, isLoading, error } = useQuery<IJob[]>({
    queryKey: ['jobs'],
    queryFn: getAllJobs,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {jobs?.map((job) =>
          userRole === 'candidate' ? (
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
