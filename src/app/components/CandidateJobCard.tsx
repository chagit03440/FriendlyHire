import React, { useState } from 'react';
import IJob from '../types/job';
import JobCard from './JobCard';


const saveJob = (jobId: string) => {
  console.log(`Job with ID: ${jobId} saved to saved jobs`);
};

const applyJob = (jobId: string) => {
  console.log(`Applied for job with ID: ${jobId}`);
};

interface CandidateJobCardProps {
  job: IJob;
}

const CandidateJobCard: React.FC<CandidateJobCardProps> = ({ job }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveJob = () => {
    saveJob(job._id);  // Handle the logic to save the job
    setIsSaved(true);   // Update UI to show that the job is saved
  };

  const handleApplyJob = () => {
    applyJob(job._id);  // Handle the logic to apply for the job
  };

  return (
    <div className="border p-4 rounded shadow-lg">
      <JobCard job={job} />
      <div className="flex justify-between mt-4">
        <button
          onClick={handleSaveJob}
          className={`px-4 py-2 bg-blue-500 text-white rounded ${isSaved ? 'bg-gray-500' : ''}`}
          disabled={isSaved}
        >
          {isSaved ? 'Saved' : 'Save Job'}
        </button>
        <button
          onClick={handleApplyJob}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default CandidateJobCard;
