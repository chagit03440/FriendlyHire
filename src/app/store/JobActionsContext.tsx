import React, { createContext, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  createApplication,
  getUserApplications,
  updateApplication,
} from "@/app/services/applicationServices"; // Assuming you have an updateApplication function
import { useUser } from "@/app/store/UserContext";
import IApplication from "../types/application";
import { ApplicationStatus } from "../types/enums";

interface JobActionsContextProps {
  handleSaveJob: (jobId: string) => Promise<void>;
  handleApplyJob: (jobId: string) => Promise<void>;
  handleArchiveJob: (jobId: string) => Promise<void>;
}

const JobActionsContext = createContext<JobActionsContextProps | undefined>(undefined);

export const useJobActions = () => {
  const context = useContext(JobActionsContext);
  if (!context) {
    throw new Error("useJobActions must be used within a JobActionsProvider");
  }
  return context;
};

export const JobActionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { mail } = useUser();

  // Helper function to check if an application exists
  const doesApplicationExist = async (jobId: string): Promise<IApplication | null> => {
    if (!mail) return null;

    const userApplications = await getUserApplications(mail);
    return userApplications.find((application: IApplication) => application.jobId._id === jobId) || null;
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
        console.log("Job status updated to 'Saved'.");
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
      console.log("Job saved successfully.");
      queryClient.invalidateQueries({ queryKey: ["userApplications", mail] });
    } catch (error) {
      console.error("Error saving the job:", error);
    }
  };

  const handleApplyJob = async (jobId: string) => {
    if (!mail) {
      console.error("User email is required to apply for the job.");
      return;
    }

    const existingApplication = await doesApplicationExist(jobId);
    if (existingApplication) {
      existingApplication.status = ApplicationStatus.Applied;
      try {
        await updateApplication(existingApplication);
        console.log("Job status updated to 'Applied'.");
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
        status: ApplicationStatus.Applied,
      });
      console.log("Job applied successfully.");
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
      console.log("Job status updated to 'Archived'.");
      queryClient.invalidateQueries({ queryKey: ["userApplications", mail] });
    } catch (error) {
      console.error("Error archiving the job:", error);
    }
  };

  return (
    <JobActionsContext.Provider
      value={{ handleSaveJob, handleApplyJob, handleArchiveJob }}
    >
      {children}
    </JobActionsContext.Provider>
  );
};
