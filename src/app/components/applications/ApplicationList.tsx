"use client";

import React, { useState } from "react";
import { useJobActions } from "@/app/store/JobActionsContext";
import IApplication from "@/app/types/application";
import ApplyEditModal from "./ApplyEditModal";
import { useRouter } from "next/navigation";
import { FaBookmark, FaArchive } from "react-icons/fa"; // Bookmark and Archive icons from react-icons

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

                  {/* Apply Button (only for saved jobs, disabled for applied, sent, and archived) */}
                  <button
                    onClick={() => handleApplyButtonClick(application.jobId._id.toString())}
                    disabled={
                      application.status !== "Saved" || applyingJob === application.jobId._id.toString()
                    }
                    className={`w-28 px-4 py-2 rounded-md text-white ${
                      applyingJob === application.jobId._id.toString()
                        ? "bg-gray-400 cursor-not-allowed"
                        : application.status === "Saved"
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {applyingJob === application.jobId._id.toString() ? "Applying..." : "Apply"}
                  </button>

                  {/* Archive Button (orange for not archived, grey for archived) */}
                  <button
                    onClick={() => handleArchiveButtonClick(application.jobId._id.toString())}
                    disabled={archivingJob === application.jobId._id.toString()}
                    className={`w-28 h-10 flex justify-center items-center rounded-md text-white ${
                      archivingJob === application.jobId._id.toString()
                        ? "bg-gray-400 cursor-not-allowed"
                        : application.status === "Archived"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600"
                    }`}
                    title="Move to Archive" // Tooltip when hovering over the archive icon
                  >
                    <FaArchive className={`text-white`} />
                  </button>
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
