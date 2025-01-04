import { useState } from "react";
import IJob from "@/app/types/job";
import IApplication from "@/app/types/application";
import { updateJob } from "../../services/jobServices";
import { getJobApplications } from "@/app/services/applicationServices";

export const useJobList = (initialJobs: IJob[]) => {
  const [jobs, setJobs] = useState<IJob[]>(initialJobs);
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  const [jobApplications, setJobApplications] = useState<IApplication[]>([]);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isEditPopUpOpen, setIsEditPopUpOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleJobAction = (jobId: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
  };

  const handleOpenPopUp = async (job: IJob) => {
    setSelectedJob(job);
    try {
      const applications = await getJobApplications(job._id);
      setJobApplications(applications);
    } catch (error) {
      console.error("Failed to fetch job applications:", error);
    } finally {
      setIsPopUpOpen(true);
    }
  };

  const handleClosePopUp = () => {
    setSelectedJob(null);
    setJobApplications([]);
    setIsPopUpOpen(false);
    setIsEditPopUpOpen(false);
  };

  const handleJobUpdate = async (updatedJob: IJob) => {
    try {
      const updated = await updateJob(updatedJob);
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === updated._id ? updated : job))
      );
    } catch (error) {
      console.error("Failed to update the job:", error);
    } finally {
      setIsEditPopUpOpen(false);
    }
  };

  const handleCloseJob = async (job: IJob) => {
    if (job.status === "Closed") return;

    const updatedJob = { ...job, status: "Closed" } as IJob;
    try {
      const updated = await updateJob(updatedJob);
      setJobs((prevJobs) =>
        prevJobs.map((j) => (j._id === updated._id ? updated : j))
      );
    } catch (error) {
      console.error("Failed to close the job:", error);
    }
  };

  return {
    jobs,
    selectedJob,
    jobApplications,
    isPopUpOpen,
    isEditPopUpOpen,
    currentPage,
    searchQuery,
    setSearchQuery,
    setCurrentPage,
    handleJobAction,
    handleOpenPopUp,
    handleClosePopUp,
    handleJobUpdate,
    handleCloseJob,
    setIsEditPopUpOpen,
    setSelectedJob,
  };
};
