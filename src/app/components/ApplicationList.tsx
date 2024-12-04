import React, { useState } from "react";
import { useJobActions } from "@/app/store/JobActionsContext";
import IApplication from "../types/application";

interface Props {
  applications: IApplication[];
}

const ApplicationList: React.FC<Props> = ({ applications }) => {
  const { handleApplyJob } = useJobActions();
  const [applyingJob, setApplyingJob] = useState<string | null>(null); // Track the job being applied for

  const handleApplyButtonClick = async (jobId: string) => {
    setApplyingJob(jobId); // Set the jobId of the job being applied for
    try {
      await handleApplyJob(jobId); // Apply for the job
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };

  return (
    <div className="application-list">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Job Title</th>
            <th className="border px-4 py-2 text-left">Company</th>
            <th className="border px-4 py-2 text-left">Status</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application._id}>
              <td className="border px-4 py-2">
                {typeof application.jobId === "object" && "title" in application.jobId
                  ? application.jobId.title
                  : "N/A"}
              </td>
              <td className="border px-4 py-2">
                {typeof application.jobId === "object" && "company" in application.jobId
                  ? application.jobId.company
                  : "N/A"}
              </td>
              <td className="border px-4 py-2">{application.status}</td>
              <td className="border px-4 py-2">
                {application.status === "Saved" &&
                application.jobId &&
                typeof application.jobId === "object" ? (
                  <button
                    onClick={() => handleApplyButtonClick(application.jobId._id.toString())}
                    disabled={applyingJob === application.jobId._id.toString()} // Disable if applying for this job
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {applyingJob === application.jobId._id.toString() ? "Applying..." : "Apply Job"}
                  </button>
                ) : (
                  <span className="text-gray-500">No Actions</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationList;
