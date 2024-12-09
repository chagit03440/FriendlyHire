"use client"
import IJob from "../types/job";
import IApplication from "../types/application";
import { sendEmail } from "@/app/utils/email";
import React, { useState } from "react";

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

    //send email to the user
    try {
      await sendEmail(
        userEmail,
        "Your Job Application Has Been Sent to Company",
        `
  <p>Dear candidate,</p>
  <p>We wanted to let you know that your application for the position of <strong>${job.title}</strong> has been reviewed by our team. Your resume and details have now been shared with the hiring manager for further consideration.</p>
  <p>If there are any updates or additional steps required, we will be sure to reach out to you promptly.</p>
  <p>Thank you for your interest in joining our team. We appreciate the time and effort you put into your application.</p>
  <p>Best regards,</p>
  <p>The [Company Name] Hiring Team</p>
  `
      );
    } catch (error) {
      console.error(error);
    }

    // Update the application status locally
    setLocalApplications((prevApplications: any) =>
      prevApplications.map((app: any) =>
        app._id === applicationId ? { ...app, status: "Sent" } : app
      )
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Applicants for {job.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            X
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
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
                  disabled={application.status === "Sent"}
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

        <div className="mt-4">
          <button
            onClick={onClose}
            className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobEmployeePopUp;
