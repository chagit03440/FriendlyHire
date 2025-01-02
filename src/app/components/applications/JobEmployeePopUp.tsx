import IJob from "@/app/types/job";
import IApplication from "@/app/types/application";
import { sendEmail } from "@/app/services/sendEmail";
import React, { useState, useEffect } from "react";
import { getUser } from "@/app/services/userServices";
import { getCandidateEmailTemplate } from "./CandidateEmailTemplate";

interface Props {
  job: IJob;
  applications: IApplication[];
  onClose: () => void;
  onUpdateStatus: (applicationId: string, newStatus: string) => void;
}

const JobEmployeePopUp: React.FC<Props> = ({
  job,
  applications,
  onClose,
  onUpdateStatus,
}) => {
  const [localApplications, setLocalApplications] =
    useState<IApplication[]>(applications);
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the names for all applicants initially
    const fetchUserNames = async () => {
      const names: { [key: string]: string } = {};
      for (const application of applications) {
        const candidate = await getUser(application.userEmail);
        names[application.userEmail] = candidate.name;
      }
      setUserNames(names);
      setLoading(false);
    };

    fetchUserNames();
  }, [applications]);

  const handleChangeStatus = async (
    applicationId: string,
    userEmail: string
  ) => {
    onUpdateStatus(applicationId, "Sent");

    const candidate = await getUser(userEmail);
    const userName = candidate.name;

    // Send email to the user
    try {
      await sendEmail(
        userEmail,
        `Your Job Application for ${job.title} Has Been Sent to ${job.company}`,
        getCandidateEmailTemplate({ candidate: userName, job: job.title })
      );
    } catch (error) {
      console.error(error);
    }

    // Update the application status locally
    setLocalApplications((prevApplications) =>
      prevApplications.map((app) =>
        app._id === applicationId
          ? ({
              ...app,
              status: "Sent",
            } as IApplication) // Cast to IApplication
          : app
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
            className="text-gray-600 hover:text-gray-900 p-2 rounded-full focus:outline-none"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <p>Loading applicants...</p>
          ) : localApplications.length > 0 ? (
            localApplications.map((application) => (
              <div
                key={application._id}
                className="flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">
                    {userNames[application.userEmail] || "Loading..."}
                  </h3>
                  <span className="text-[12px]">
                    Status:{" "}
                    <span style={{ fontStyle: "italic" }}>
                      {application.status}
                    </span>
                  </span>
                </div>
                <button
                  onClick={() =>
                    handleChangeStatus(application._id, application.userEmail)
                  }
                  className="bg-orange-400 text-white px-4 py-2 rounded disabled:bg-gray-400"
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
            className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobEmployeePopUp;
