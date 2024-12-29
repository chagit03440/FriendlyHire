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
  job ,
  onView,
  onEdit,
  onClose,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-md flex flex-col">
      <JobCard job={job} />
      <div className="mb-4">
        <span className="font-semibold">Status:</span> {job.status}
      </div>
      <JobActions job={job} onView={onView} onEdit={onEdit} onClose={onClose} />
    </div>
  );
};

export default EmployeeJobCard;