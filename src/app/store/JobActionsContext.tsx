// Import required dependencies and services
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
import { getEmployeeEmailTemplate } from "../components/employee/EmployeeEmailTemplate";

// Define the shape of the context's values
interface JobActionsContextProps {
  handleSaveJob: (jobId: string) => Promise<void>;
  handleApplyJob: (jobId: string) => Promise<void>;
  handleArchiveJob: (jobId: string) => Promise<void>;
  handleSendJob: (jobId: string) => Promise<void>;
  handleDeleteJob: (jobId: string) => Promise<void>;
}

// Create the context
const JobActionsContext = createContext<JobActionsContextProps | undefined>(
  undefined
);

// Custom hook to access JobActionsContext
export const useJobActions = () => {
  const context = useContext(JobActionsContext);
  if (!context) {
    throw new Error("useJobActions must be used within a JobActionsProvider");
  }
  return context;
};

// Provider component to wrap around children that need job actions
export const JobActionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient(); // React Query client for caching and invalidating queries
  const { mail } = useUser(); // Access user email from context

  // Helper function to check if an application already exists for a job
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

  // Handle saving a job
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

  // Handle applying for a job
  const handleApplyJob = async (jobId: string) => {
    if (!mail) {
      console.error("User email is required to apply for the job.");
      return;
    }

    const sendJobNotification = async (
      job: IJob,
      userName: string,
      attachmentUrl?: string
    ) => {
      const jobCreator = await getUser(job.createdBy);
      const emailData = {
        jobCreatorName: jobCreator.name,
        userName: userName,
        jobTitle: job.title,
      };

      try {
        await sendEmail(
          job.createdBy,
          `New Application Received for ${job.title} from ${userName}`,
          getEmployeeEmailTemplate(emailData),
          attachmentUrl
        );
      } catch (error) {
        console.error("Error sending notification email:", error);
      }
    };

    try {
      const existingApplication = await doesApplicationExist(jobId);
      const job = await getJobById(jobId);
      const user = await getUser(mail);

      if (existingApplication) {
        existingApplication.status = ApplicationStatus.Applied;
        await updateApplication(existingApplication);
        queryClient.invalidateQueries({ queryKey: ["userApplications", mail] });
      } else {
        await createApplication({
          userEmail: mail,
          jobId,
          fileUrl: user.fileUrl,
          status: ApplicationStatus.Applied,
        });
        queryClient.invalidateQueries({ queryKey: ["userApplications", mail] });
      }

      await sendJobNotification(job, user.name, user.fileUrl);
    } catch (error) {
      console.error("Error processing job application:", error);
    }
  };

  // Handle archiving a job
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

  // Handle sending a job application
  const handleSendJob = async (applicationId: string) => {
    if (!mail) {
      console.error("Employee email is required to send the application.");
      return;
    }

    try {
      const applicationToSend = await getApplicationById(applicationId);
      if (!applicationToSend) {
        console.error("Application not found for the specified ID.");
        return;
      }

      applicationToSend.status = ApplicationStatus.Sent;
      await updateApplication(applicationToSend);
      queryClient.invalidateQueries({ queryKey: ["userApplications", mail] });
    } catch (error) {
      console.error("Error sending the application:", error);
    }
  };

  // Handle deleting a job
  const handleDeleteJob = async (jobId: string) => {
    if (!mail) {
      console.error("User email is required to delete the job.");
      return;
    }

    try {
      await deleteJob(jobId);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    } catch (error) {
      console.error("Error deleting the job:", error);
    }
  };

  // Provide context values to children components
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
