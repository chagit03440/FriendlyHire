import React, { useState } from "react";
import IJob from "../types/job";
import JobCard from "./JobCard";
import { useJobActions } from "@/app/store/JobActionsContext"; // Import the context for job actions

interface CandidateJobCardProps {
  job: IJob;
}

const CandidateJobCard: React.FC<CandidateJobCardProps> = ({ job }) => {
  const [isSaved, setIsSaved] = useState(false);
  const { handleSaveJob, handleApplyJob } = useJobActions(); // Access the job actions from context

  const onSaveJob = () => {
    handleSaveJob(job._id); // Save the job using the context method
    setIsSaved(true); // Update UI state to indicate the job is saved
  };

  const onApplyJob = () => {
    handleApplyJob(job._id); // Apply for the job using the context method
  };

  return (
    <div className="border p-4 rounded shadow-lg">
      <JobCard job={job} />
      <div className="flex justify-between mt-4">
        <button
          onClick={onSaveJob}
          className={`px-4 py-2 bg-blue-500 text-white rounded ${isSaved ? "bg-gray-500" : ""}`}
          disabled={isSaved}
        >
          {isSaved ? "Saved" : "Save Job"}
        </button>
        <button
          onClick={onApplyJob}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default CandidateJobCard;
