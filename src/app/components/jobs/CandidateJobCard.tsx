import React, { useState } from "react";
import IJob from "../../types/job";
import JobCard from "./JobCard";
import { useJobActions } from "@/app/store/JobActionsContext";
import { FaBookmark, FaPaperPlane } from "react-icons/fa"; // Import both the bookmark and apply icons

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
    if (percentage >= 80) return "bg-orange-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-gray-500";
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
    <div className="border p-6 rounded-lg shadow-lg bg-gray-800 text-white">
      <div className="mb-4 p-3 bg-gray-700 rounded-lg flex items-center gap-4">
        <div className="flex-1 relative h-3 bg-gray-600 rounded-full overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full transition-all duration-500 ${getMatchColor(
              job.matchPercentage || 0
            )}`}
            style={{ width: `${job.matchPercentage || 0}%` }}
          />
        </div>
        <div className="text-sm text-gray-400 font-medium whitespace-nowrap">
          {job.matchPercentage || 0}% Match
        </div>
      </div>

      <JobCard job={job} />

      <div className="flex justify-between mt-4 gap-4">
        {/* Save Job with Icon and Tooltip */}
        <div className="flex-1 group relative">
          <button
            onClick={onSaveJob}
            disabled={isSaved}
            className={`w-28 h-10 flex justify-center items-center rounded-md text-white ${
              isSaved
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-transparent border-2 border-orange-500 hover:bg-orange-500"
            }`}
            title="Save Job" // Tooltip text on hover
          >
            <FaBookmark
              className={`${
                isSaved ? "text-gray-400" : "text-orange-500"
              } transition-all duration-200`}
            />
          </button>
        </div>

        {/* Apply Now Button with Icon */}
        <div className="flex-1 group relative">
          <button
            onClick={onApplyJob}
            className="w-28 h-10 flex justify-center items-center rounded-md text-white bg-transparent border-2 border-orange-500 hover:bg-orange-500"
            title="Apply Now"
          >
            <FaPaperPlane className="text-orange-500 transition-all duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateJobCard;
