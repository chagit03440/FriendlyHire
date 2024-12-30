import React from "react";
import IJob from "@/app/types/job";
import JobCard from "./JobCard";
import JobActions from "./JobActions";

interface EmployeeJobCardProps {
  job: IJob;
  onView: (job: IJob) => void;
  onEdit: (job: IJob) => void;
  onClose: (job: IJob) => void;
}

const EmployeeJobCard: React.FC<EmployeeJobCardProps> = ({
  job,
  onView,
  onEdit,
  onClose,
}) => {
  return (
    <div className="border p-6 rounded-lg shadow-lg bg-gray-800 text-white h-full flex flex-col justify-between">
      {/* Job Card */}
      <JobCard job={job} />

      {/* Job Status */}
      <div className="mb-4 p-3 bg-gray-700 rounded-lg">
        <span className="font-semibold">Status:</span> {job.status}
      </div>

      {/* Job Actions (View, Edit, Close) */}
      <JobActions job={job} onView={onView} onEdit={onEdit} onClose={onClose} />

    </div>
  );
};

export default EmployeeJobCard;
