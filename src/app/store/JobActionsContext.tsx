import React, { createContext, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  createApplication,
  getApplicationById,
  getUserApplications,
  updateApplication,
} from "@/app/services/applicationServices";
import { useUser } from "@/app/store/UserContext";
import IApplication from "../types/application";
import { ApplicationStatus } from "../types/enums";
import { deleteJob, getJobById } from "../services/jobServices";
import { sendEmail } from "../services/sendEmail";
import IJob from "../types/job";
import { getUser } from "../services/userServices";
import IUser from "../types/user";
// import { sendEmail } from "../utils/email";

interface JobActionsContextProps {
  handleSaveJob: (jobId: string) => Promise<void>;
  handleApplyJob: (jobId: string) => Promise<void>;
  handleArchiveJob: (jobId: string) => Promise<void>;
  handleSendJob: (jobId: string) => Promise<void>;
  handleDeleteJob:  (jobId: string) => Promise<void>;
}

const JobActionsContext = createContext<JobActionsContextProps | undefined>(
  undefined
);

export const useJobActions = () => {
  const context = useContext(JobActionsContext);
  if (!context) {
    throw new Error("useJobActions must be used within a JobActionsProvider");
  }
  return context;
};

export const JobActionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const { mail } = useUser();

  const doesApplicationExist = async (
    jobId: string
  ): Promise<IApplication | null> => {
    if (!mail) return null;

    const userApplications = await getUserApplications(mail);
    return (
      userApplications.find(
        (application: IApplication) => application.jobId._id === jobId
      ) || null
    );
  };

  const handleSaveJob = async (jobId: string) => {
    if (!mail) {
      console.error("User email is required to save the job.");
      return;
    }

    const existingApplication = await doesApplicationExist(jobId);
    if (existingApplication) {
      existingApplication.status = ApplicationStatus.Saved;
      try {
        await updateApplication(existingApplication);
        queryClient.invalidateQueries({ queryKey: ["userApplications", mail] });
      } catch (error) {
        console.error("Error updating the job status:", error);
      }
      return;
    }

    try {
      await createApplication({
        userEmail: mail,
        jobId,
        fileUrl: "file:///C:/path/to/your/CV.pdf",
        status: ApplicationStatus.Saved,
      });
      queryClient.invalidateQueries({ queryKey: ["userApplications", mail] });
    } catch (error) {
      console.error("Error saving the job:", error);
    }
  };

  const createApplicationEmailBody = (userName: string, jobTitle: string) => `
  <p>Dear Employee,</p>
  <p>We are excited to inform you that <strong>${userName}</strong> has applied for the <strong>${jobTitle}</strong> position you posted.</p>
  <p>The candidate has submitted their application and is eagerly looking forward to the next steps.</p>
  <p>If you would like to review their application or require further information, please feel free to reach out to us.</p>
  <p>Best regards,</p>
  <p>Friendly Hire Team</p>
`;

const handleApplyJob = async (jobId: string) => {
  if (!mail) {
    console.error("User email is required to apply for the job.");
    return;
  }

  let user: IUser;

  const existingApplication = await doesApplicationExist(jobId);
  if (existingApplication) {
    existingApplication.status = ApplicationStatus.Applied;
    user = await getUser(existingApplication.userEmail);

    try {
      await updateApplication(existingApplication);
      queryClient.invalidateQueries({ queryKey: ["userApplications", mail] });
    } catch (error) {
      console.error("Error updating the job status:", error);
    }

    // Send email to the job creator
    try {
      const job: IJob = await getJobById(jobId);
      const userName = user.name || "A candidate"; // Fallback if name is unavailable
      const emailBody = createApplicationEmailBody(userName, job.title);

      await sendEmail(
        job.createdBy,
        "New Application Received for Your Job Posting",
        emailBody
      );
    } catch (error) {
      console.error("Error sending notification email:", error);
    }

    return;
  }

  try {
    user = await getUser(mail);
    await createApplication({
      userEmail: mail,
      jobId,
      fileUrl: "file:///C:/path/to/your/CV.pdf",
      status: ApplicationStatus.Applied,
    });

    // Send email to the job creator
    try {
      const job: IJob = await getJobById(jobId);
      const userName = user.name || "A candidate"; // Fallback if name is unavailable
      const emailBody = createApplicationEmailBody(userName, job.title);

      await sendEmail(
        job.createdBy,
        "New Application Received for Your Job Posting",
        emailBody
      );
    } catch (error) {
      console.error("Error sending notification email:", error);
    }

    queryClient.invalidateQueries({ queryKey: ["userApplications", mail] });
  } catch (error) {
    console.error("Error applying for the job:", error);
  }
};

  const handleArchiveJob = async (jobId: string) => {
    if (!mail) {
      console.error("User email is required to archive the job.");
      return;
    }

    const existingApplication = await doesApplicationExist(jobId);
    if (!existingApplication) {
      console.error("Application not found for the specified job ID.");
      return;
    }

    existingApplication.status = ApplicationStatus.Archived;
    try {
      await updateApplication(existingApplication);
      queryClient.invalidateQueries({ queryKey: ["userApplications", mail] });
    } catch (error) {
      console.error("Error archiving the job:", error);
    }
  };

  const handleSendJob = async (applicationId: string) => {
    if (!mail) {
      console.error("Employee email is required to send the application.");
      return;
    }

    try {
      // Fetch the application by its ID
      const applicationToSend = await getApplicationById(applicationId);
      if (!applicationToSend) {
        console.error("Application not found for the specified ID.");
        return;
      }

      // Update the application's status to "Sent"
      applicationToSend.status = ApplicationStatus.Sent;

      // Call the update API to save the changes
      await updateApplication(applicationToSend);

      // Invalidate the query cache for the user's applications
      queryClient.invalidateQueries({ queryKey: ["userApplications", mail] });
    } catch (error) {
      console.error("Error sending the application:", error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!mail) {
      console.error("User email is required to delete the job.");
      return;
    }
  
    try {
      // Call the service to delete the job
      await deleteJob(jobId);
  
      // Invalidate query cache related to jobs
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    } catch (error) {
      console.error("Error deleting the job:", error);
    }
  };

  return (
    <JobActionsContext.Provider
      value={{
        handleSaveJob,
        handleApplyJob,
        handleArchiveJob,
        handleSendJob,
        handleDeleteJob,
      }}
    >
      {children}
    </JobActionsContext.Provider>
  );
};
