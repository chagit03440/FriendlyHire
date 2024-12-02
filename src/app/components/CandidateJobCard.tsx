import React, { useState } from 'react';
import IJob from '../types/job';
import JobCard from './JobCard';
import { useUser } from "@/app/context/UserContext";
import { createApplication } from '../services/applicationServices';

const saveJob = (jobId: string) => {
  console.log(`Job with ID: ${jobId} saved to saved jobs`);
};

const applyJob = (userEmail: string | null, jobId: string) => {
  if (!userEmail) {
    console.error('User email is required to apply for the job.');
    return;  // Return early if userEmail is null
  }

  const newApplication = {
    userEmail,
    jobId,
    fileUrl: "file:///C:/Users/chagi/Desktop/%D7%A7%D7%95%D7%A8%D7%95%D7%AA%20%D7%97%D7%99%D7%99%D7%9D/Chagit%20Orenstein%20CV.pdf", 
    status: "Sent" as const,  // Ensure the status is a valid string literal
  };

  createApplication(newApplication)
    .then(response => {
      console.log('Successfully applied for the job:', response);
    })
    .catch(error => {
      console.error('Error applying for the job:', error);
    });
};

interface CandidateJobCardProps {
  job: IJob;
}

const CandidateJobCard: React.FC<CandidateJobCardProps> = ({ job }) => {
  const [isSaved, setIsSaved] = useState(false);
  const { mail } = useUser(); // Get the current user's email

  const handleSaveJob = () => {
    saveJob(job._id);  // Handle the logic to save the job
    setIsSaved(true);   // Update UI to show that the job is saved
  };

  const handleApplyJob = () => {
    console.log("email", mail);
    applyJob(mail, job._id);  // Apply for the job with the user's email and job ID
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
