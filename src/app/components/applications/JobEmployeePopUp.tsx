"use client";
import IJob from "@/app/types/job";
import IApplication from "@/app/types/application";
import { sendEmail } from "@/app/services/sendEmail";
import React, { useState } from "react";
import { getUser } from "@/app/services/userServices";
import { getCandidateEmailTemplate } from "./CandidateEmailTemplate";

interface Props {
  job: IJob; // The job for which we are showing applicants
  applications: IApplication[]; // List of applications for the job
  onClose: () => void; // Function to close the popup
  onUpdateStatus: (applicationId: string, newStatus: string) => void; // Function to update the application status
}

const JobEmployeePopUp: React.FC<Props> = ({
  job,
  applications,
  onClose,
  onUpdateStatus,
}) => {
  const [localApplications, setLocalApplications] = useState(applications);

  // Function to handle changing the status of an application to "Sent"
  const handleChangeStatus = async (
    applicationId: string,
    userEmail: string
  ) => {
    onUpdateStatus(applicationId, "Sent");

    const candidate = await getUser(userEmail);
    console.log(
      `the candidate email and name is: ${candidate.email} ${candidate.name}`
    );
    //send email to the user
    try {
      await sendEmail(
        userEmail,
        `Your Job Application for ${job.title} Has Been Sent to ${job.company}`,
        getCandidateEmailTemplate({ candidate: candidate.name, job: job.title })
      );
    } catch (error) {
      console.error(error);
    }

    // Update the application status locally
    setLocalApplications(
      (prevApplications) =>
        prevApplications.map((app) =>
          app._id === applicationId ? { ...app, status: "Sent" } : app
        ) as IApplication[]
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Applicants for {job.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-full focus:outline-none"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {localApplications.length > 0 ? (
            localApplications.map((application) => (
              <div
                key={application._id}
                className="flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">{application.userEmail}</h3>
                  <p>Status: {application.status}</p>
                </div>
                <button
                  onClick={() =>
                    handleChangeStatus(application._id, application.userEmail)
                  }
                  className={`px-4 py-2 rounded text-white ${
                    application.status === "Applied"
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={application.status !== "Applied"}
                >
                  {application.status === "Sent"
                    ? "Already Sent"
                    : "Mark as Sent"}
                </button>
              </div>
            ))
          ) : (
            <p>No applicants yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobEmployeePopUp;
