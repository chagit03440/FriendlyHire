import React from "react";
import IJob from "@/app/types/job";

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
  const buttonStyle = {
    marginTop: "8px",
    width: "100%",
    color: "#fff",
  };

  const buttonColors = {
    view: "#007bff",
    edit: "#ffc107",
    close: "#dc3545",
  };

  return (
    <div className="mt-auto">
      <button
        onClick={() => onView(job)}
        className="w-full mt-2 p-2 text-white rounded"
        style={{ ...buttonStyle, backgroundColor: buttonColors.view }}
      >
        View Applications
      </button>
      <button
        onClick={() => onEdit(job)}
        className="w-full mt-2 p-2 text-white rounded"
        style={{ ...buttonStyle, backgroundColor: buttonColors.edit }}
      >
        Edit
      </button>
      <button
        onClick={() => onClose(job)}
        className="w-full mt-2 p-2 text-white rounded"
        style={{
          ...buttonStyle,
          backgroundColor:
            job.status === "Closed" ? "#6c757d" : buttonColors.close,
          cursor: job.status === "Closed" ? "not-allowed" : "pointer",
        }}
        disabled={job.status === "Closed"}
      >
        Close Job
      </button>
    </div>
  );
};

export default JobActions;