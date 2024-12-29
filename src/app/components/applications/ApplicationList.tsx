import React, { useState } from "react";
import { useJobActions } from "@/app/store/JobActionsContext";
import IApplication from "@/app/types/application";
import ApplyEditModal from "./ApplyEditModal";
import { useRouter } from "next/navigation";

interface Props {
  applications: IApplication[];
}

const ApplicationList: React.FC<Props> = ({ applications }) => {
  const { handleApplyJob, handleArchiveJob } = useJobActions(); // Use the archive action from context
  const [applyingJob, setApplyingJob] = useState<string | null>(null); // Track the job being applied for
  const [archivingJob, setArchivingJob] = useState<string | null>(null); // Track the job being archived
  const [modalJobId, setModalJobId] = useState<string | null>(null); // Track the jobId for the modal
  const router = useRouter();

  const handleApplyButtonClick = (jobId: string) => {
    setModalJobId(jobId); // Open the modal for this job
  };

  const handleArchiveButtonClick = async (jobId: string) => {
    setArchivingJob(jobId); // Set the jobId of the job being archived
    try {
      await handleArchiveJob(jobId); // Archive the job
    } catch (error) {
      console.error("Error archiving job:", error);
    } finally {
      setArchivingJob(null); // Reset archiving job state
    }
  };

  const handleApplyNow = async () => {
    if (!modalJobId) return;

    setApplyingJob(modalJobId); // Set the jobId of the job being applied for
    try {
      await handleApplyJob(modalJobId); // Apply for the job
    } catch (error) {
      console.error("Error applying for job:", error);
    } finally {
      setApplyingJob(null); // Reset applying job state
      setModalJobId(null); // Close the modal
    }
  };

  const handleEditResume = () => {
    if (!modalJobId) return;
    // Redirect to resume edit page
    router.push("/pages/home/candidate/uploadResume");
    setModalJobId(null); // Close the modal
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
              <td className="border px-4 py-2 space-x-2">
                {/* Apply Button: Only show if status is 'Saved' */}
                {application.status === "Saved" && application.jobId && typeof application.jobId === "object" && (
                  <button
                    onClick={() => handleApplyButtonClick(application.jobId._id.toString())}
                    disabled={applyingJob === application.jobId._id.toString()} // Disable if applying for this job
                    className={`px-4 py-2 rounded ${
                      applyingJob === application.jobId._id.toString()
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {applyingJob === application.jobId._id.toString() ? "Applying..." : "Apply Job"}
                  </button>
                )}

                {/* Archive Button: Show for all statuses except 'Archived' */}
                {application.status !== "Archived" && application.jobId && typeof application.jobId === "object" && (
                  <button
                    onClick={() => handleArchiveButtonClick(application.jobId._id.toString())}
                    disabled={archivingJob === application.jobId._id.toString()} // Disable if archiving this job
                    className={`px-4 py-2 rounded ${
                      archivingJob === application.jobId._id.toString()
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {archivingJob === application.jobId._id.toString() ? "Archiving..." : "Archive"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Apply/Edit Modal */}
      <ApplyEditModal
        isOpen={modalJobId !== null}
        onClose={() => setModalJobId(null)} // Close the modal
        onApplyNow={handleApplyNow} // Apply for the job
        onEditResume={handleEditResume} // Edit the resume
        loading={applyingJob === modalJobId} // Check if this job is being applied for
      />
    </div>
  );
};

export default ApplicationList;
