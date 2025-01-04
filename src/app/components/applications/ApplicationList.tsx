"use client";

import React, { useState } from "react";
import { useJobActions } from "@/app/store/JobActionsContext";
import IApplication from "@/app/types/application";
import ApplyEditModal from "./ApplyEditModal";
import { useRouter } from "next/navigation";
import { FaPaperPlane, FaArchive, FaEye } from "react-icons/fa"; // Save, Apply, Archive, View icons
import JobDetailsPopUp from "../jobs/JobDetailsPopUp";
import IJob from "@/app/types/job";
import { getJobById } from "@/app/services/jobServices";
import toast, { Toaster } from "react-hot-toast";

interface Props {
  applications: IApplication[];
}

const ApplicationList: React.FC<Props> = ({ applications }) => {
  const { handleApplyJob, handleArchiveJob } = useJobActions();
  const [applyingJob, setApplyingJob] = useState<string | null>(null);
  const [archivingJob, setArchivingJob] = useState<string | null>(null);
  const [modalJobId, setModalJobId] = useState<string | null>(null);
  const [viewingJob, setViewingJob] = useState<IJob | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Controls JobDetailsPopUp visibility
  const router = useRouter();

  const handleApplyButtonClick = (jobId: string) => {
    setModalJobId(jobId);
  };

  const handleArchiveButtonClick = async (jobId: string) => {
    setArchivingJob(jobId);
    try {
      await handleArchiveJob(jobId);
      toast.success("Job archived successfully.");
    } catch (error) {
      const errorMessage = "Error archiving job. Please try again.";
      toast.error(errorMessage);
      console.error(errorMessage, error);
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
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error instanceof Error && error.message.includes("Job is closed")) {
        errorMessage = "This job is no longer accepting applications.";
        toast.error(errorMessage);
      }
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

  const handleViewDetails = async (application: IApplication) => {
    if (typeof application.jobId === "object") {
      const job = await getJobById(application.jobId._id.toString());
      setViewingJob(job);
      setIsPopupOpen(true); // Open the popup
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
    setViewingJob(null);
  };

  return (
    <>
      <Toaster />
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
                    <span
                      className={`text-sm font-medium ${application.status === "Saved"
                          ? "text-gray-500"
                          : application.status === "Applied"
                            ? "text-gray-500"
                            : application.status === "Sent"
                              ? "text-gray-500"
                              : application.status === "Archived"
                                ? "text-gray-400"
                                : "text-gray-500"
                        }`}
                    >
                      {application.status}
                    </span>
                    <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
                            <button
                              onClick={() => handleViewDetails(application)}
                              className="p-2 rounded-full text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-200"
                              title="View Details"
                            >
                              <FaEye className="text-xl" />
                            </button>

                            {application.status === "Saved" && (
                              <button
                                onClick={() =>
                                  handleApplyButtonClick(application.jobId._id.toString())
                                }
                                disabled={applyingJob === application.jobId._id.toString()}
                                className="p-2 rounded-full text-orange-400 hover:bg-orange-400 hover:text-white transition-all duration-200"
                                title="Apply Now"
                              >
                                <FaPaperPlane className="text-xl" />
                              </button>
                            )}

                            {application.status !== "Archived" && (
                              <button
                                onClick={() =>
                                  handleArchiveButtonClick(application.jobId._id.toString())
                                }
                                disabled={archivingJob === application.jobId._id.toString()}
                                className="p-2 rounded-full text-orange-400 hover:bg-orange-400 hover:text-white transition-all duration-200"
                                title="Move to Archive"
                              >
                                <FaArchive className="text-xl" />
                              </button>
                            )}
                          </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ApplyEditModal
          isOpen={modalJobId !== null}
          onClose={() => setModalJobId(null)}
          onApplyNow={handleApplyNow}
          onEditResume={handleEditResume}
          loading={applyingJob === modalJobId}
        />

        {viewingJob && (
          <JobDetailsPopUp
            job={viewingJob}
            isOpen={isPopupOpen}
            onClose={handleClosePopup}
          />
        )}
      </div>
    </>
  );
};

export default ApplicationList;
