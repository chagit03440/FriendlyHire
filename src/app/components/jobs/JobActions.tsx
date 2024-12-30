import React from "react";
import IJob from "@/app/types/job";
import { FaEye, FaEdit, FaTimes } from "react-icons/fa"; // Importing icons

interface JobActionsProps {
  job: IJob;
  onView: (job: IJob) => void;
  onEdit: (job: IJob) => void;
  onClose: (job: IJob) => void;
}

const JobActions: React.FC<JobActionsProps> = ({
  job,
  onView,
  onEdit,
  onClose,
}) => {
  return (
    <div className="mt-auto flex justify-between gap-4">
      {/* View Applications Button */}
      <div className="w-full group relative">
        <button
          onClick={() => onView(job)}
          className="w-full h-14 flex justify-center items-center rounded-full text-orange-500 bg-transparent hover:bg-orange-500 hover:text-white transition-all duration-200"
          title="View Applications"
        >
          <FaEye className="text-xl" />
        </button>
      </div>

      {/* Edit Button */}
      <div className="w-full group relative">
        <button
          onClick={() => onEdit(job)}
          className="w-full h-14 flex justify-center items-center rounded-full text-orange-500 bg-transparent hover:bg-orange-500 hover:text-white transition-all duration-200"
          title="Edit"
        >
          <FaEdit className="text-xl" />
        </button>
      </div>

      {/* Close Job Button */}
      <div className="w-full group relative">
        <button
          onClick={() => onClose(job)}
          className="w-full h-14 flex justify-center items-center rounded-full text-orange-500 bg-transparent hover:bg-orange-500 hover:text-white transition-all duration-200"
          disabled={job.status === "Closed"}
          title="Close Job"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default JobActions;
