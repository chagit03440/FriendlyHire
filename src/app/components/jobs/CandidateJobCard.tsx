import React, { useState } from "react";
import IJob from "../../types/job";
import JobCard from "./JobCard";
import { useJobActions } from "@/app/store/JobActionsContext";

interface CandidateJobCardProps {
  job: IJob;
  onJobAction: (jobId: string) => void; // Callback for job actions
}

const CandidateJobCard: React.FC<CandidateJobCardProps> = ({
  job,
  onJobAction,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const { handleSaveJob, handleApplyJob } = useJobActions();

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const onSaveJob = () => {
    handleSaveJob(job._id);
    setIsSaved(true);
    onJobAction(job._id); // Notify parent
  };

  const onApplyJob = () => {
    handleApplyJob(job._id);
    onJobAction(job._id); // Notify parent
  };

  return (
    <div className="border p-4 rounded-lg shadow-lg bg-white">
      <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center gap-4">
        <div className="flex-1 relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full transition-all duration-500 ${getMatchColor(
              job.matchPercentage || 0
            )}`}
            style={{ width: `${job.matchPercentage || 0}%` }}
          />
        </div>
        <div className="text-sm text-gray-600 font-medium whitespace-nowrap">
          {job.matchPercentage || 0}% Match
        </div>
      </div>

      <JobCard job={job} />

      <div className="flex justify-between mt-4 gap-4">
        <button
          onClick={onSaveJob}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 ${
            isSaved
              ? "bg-gray-200 text-gray-600"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          disabled={isSaved}
        >
          {isSaved ? "Saved" : "Save Job"}
        </button>
        <button
          onClick={onApplyJob}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default CandidateJobCard;
