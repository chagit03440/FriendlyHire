import React, { createContext, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createApplication, getUserApplications, updateApplication } from "@/app/services/applicationServices"; // Assuming you have an updateApplication function
import { useUser } from "@/app/store/UserContext";
import IApplication from "../types/application";

interface JobActionsContextProps {
  handleSaveJob: (jobId: string) => Promise<void>;
  handleApplyJob: (jobId: string) => Promise<void>;
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
  const doesApplicationExist = async (jobId: string) => {
    if (!mail) return false;
    
    const { data: applications = [] } = await queryClient.fetchQuery({
      queryKey: ["userApplications", mail],
      queryFn: () => getUserApplications(mail),
    });
    console.log("mail",mail);
    console.log("applications",applications);
    console.log("jobid",jobId);
    return applications.find((application: IApplication) => application.jobId._id == jobId.toString());
  };

  const handleSaveJob = async (jobId: string) => {
    if (!mail) {
      console.error("User email is required to save the job.");
      return;
    }

    // Check if the application already exists
    const existingApplication = await doesApplicationExist(jobId);
    if (existingApplication) {
      // If the job is already saved, update the status to 'Saved'
      try {
        await updateApplication(existingApplication._id, {
          title: existingApplication.jobId.title,
          director: existingApplication.jobId.company, // Update with relevant fields from the job
          releaseYear: existingApplication.jobId.releaseYear, // Adjust based on the actual data structure
        });
        console.log("Job status updated to 'Saved'.");
        queryClient.invalidateQueries({ queryKey: ["userApplications", mail] });
      } catch (error) {
        console.error("Error updating the job status:", error);
      }
      return;
    }

    // If no application exists, create a new one
    try {
      await createApplication({
        userEmail: mail,
        jobId,
        fileUrl: "file:///C:/path/to/your/CV.pdf",
        status: "Saved",
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

    // Check if the application already exists
    const existingApplication = await doesApplicationExist(jobId);
    if (existingApplication) {
      // If the job is already applied for, update the status to 'Sent'
      try {
        await updateApplication(existingApplication._id, {
          title: existingApplication.jobId.title,
          director: existingApplication.jobId.company, // Update with relevant fields from the job
          releaseYear: existingApplication.jobId.releaseYear, // Adjust based on the actual data structure
        });
        console.log("Job status updated to 'Sent'.");
        queryClient.invalidateQueries({ queryKey: ["userApplications", mail] });
      } catch (error) {
        console.error("Error updating the job status:", error);
      }
      return;
    }

    // If no application exists, create a new one
    try {
      await createApplication({
        userEmail: mail,
        jobId,
        fileUrl: "file:///C:/path/to/your/CV.pdf",
        status: "Sent",
      });
      console.log("Job applied successfully.");
      queryClient.invalidateQueries({ queryKey: ["userApplications", mail] });
    } catch (error) {
      console.error("Error applying for the job:", error);
    }
  };

  return (
    <JobActionsContext.Provider value={{ handleSaveJob, handleApplyJob }}>
      {children}
    </JobActionsContext.Provider>
  );
};
