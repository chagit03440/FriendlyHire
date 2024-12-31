import React, { useState } from "react";
import { useJobActions } from "@/app/store/JobActionsContext";
import IApplication from "@/app/types/application";
import ApplyEditModal from "./ApplyEditModal";
import { useRouter } from "next/navigation";
import { FaBookmark, FaPaperPlane, FaArchive } from "react-icons/fa"; // Save, Apply, Archive icons

interface Props {
  applications: IApplication[];
}

const ApplicationList: React.FC<Props> = ({ applications }) => {
  const { handleApplyJob, handleArchiveJob } = useJobActions();
  const [applyingJob, setApplyingJob] = useState<string | null>(null);
  const [archivingJob, setArchivingJob] = useState<string | null>(null);
  const [modalJobId, setModalJobId] = useState<string | null>(null);
  const router = useRouter();

  const handleApplyButtonClick = (jobId: string) => {
    setModalJobId(jobId);
  };

  const handleArchiveButtonClick = async (jobId: string) => {
    setArchivingJob(jobId);
    try {
      await handleArchiveJob(jobId);
    } catch (error) {
      console.error("Error archiving job:", error);
    } finally {
      setArchivingJob(null);
    }
  };

  const handleApplyNow = async () => {
    if (!modalJobId) return;

    setApplyingJob(modalJobId);
    try {
      await handleApplyJob(modalJobId);
    } catch (error) {
      console.error("Error applying for job:", error);
    } finally {
      setApplyingJob(null);
      setModalJobId(null);
    }
  };

  const handleEditResume = () => {
    if (!modalJobId) return;
    router.push("/pages/home/candidate/uploadResume");
    setModalJobId(null);
  };

  return (
    <div className="application-list">
      <div className="bg-white text-black p-6 rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application._id}
                className="flex justify-between items-center p-4 bg-gray-800 text-white rounded-lg shadow-sm hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-medium">
                    {typeof application.jobId === "object" && "title" in application.jobId
                      ? application.jobId.title
                      : "N/A"}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {typeof application.jobId === "object" && "company" in application.jobId
                      ? application.jobId.company
                      : "N/A"}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Status - plain text */}
                  <span
                    className={`text-sm font-medium text-gray-400 ${
                      application.status === "Saved"
                        ? "text-orange-500"
                        : application.status === "Applied"
                        ? "text-gray-500"
                        : application.status === "Sent"
                        ? "text-gray-500"
                        : application.status === "Archived"
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {application.status === "Saved" ? (
                      <FaBookmark className="text-orange-500 inline mr-2" />
                    ) : (
                      application.status
                    )}
                  </span>

                  {/* Apply Icon Button (only for saved jobs) */}
                  {application.status === "Saved" && (
                    <div className="flex-1 group relative">
                      <button
                        onClick={() => handleApplyButtonClick(application.jobId._id.toString())}
                        disabled={applyingJob === application.jobId._id.toString()}
                        className="p-2 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-200"
                        title="Apply Now"
                      >
                        <FaPaperPlane className="text-xl" />
                      </button>
                    </div>
                  )}

                  {/* Archive Icon Button (visible only if the job isn't archived) */}
                  {application.status !== "Archived" && (
                     <button
                      onClick={() => handleArchiveButtonClick(application.jobId._id.toString())}
                      disabled={archivingJob === application.jobId._id.toString()}
                      className="p-2 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-200"
                      title="Move to Archive"
                   >
                     <FaArchive className="text-xl" />
                   </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply/Edit Modal */}
      <ApplyEditModal
        isOpen={modalJobId !== null}
        onClose={() => setModalJobId(null)}
        onApplyNow={handleApplyNow}
        onEditResume={handleEditResume}
        loading={applyingJob === modalJobId}
      />
    </div>
  );
};

export default ApplicationList;
