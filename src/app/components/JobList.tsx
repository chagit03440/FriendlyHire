import React, { useState } from "react";
import IJob from "../types/job";
import JobCard from "./JobCard";
import CandidateJobCard from "./CandidateJobCard";
import { useUser } from "../store/UserContext";
import JobEmployeePopUp from "./JobEmployeePopUp";
import EditJobForm from "./EditJobForm ";
import { getJobApplications } from "../services/applicationServices";
import IApplication from "../types/application";
import { JobActionsProvider, useJobActions } from "../store/JobActionsContext";
import { updateJob } from "../services/jobServices";
import ReactPaginate from "react-paginate";

interface JobListProps {
  jobs: IJob[];
}

const JobList: React.FC<JobListProps> = ({ jobs: initialJobs }) => {
  const { role } = useUser();
  const [jobs, setJobs] = useState<IJob[]>(initialJobs);
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  const [jobApplications, setJobApplications] = useState<IApplication[]>([]);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isEditPopUpOpen, setIsEditPopUpOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const { handleSendJob, handleDeleteJob } = useJobActions();

  const jobsPerPage = 6; // Display 6 jobs per page

  const startIndex = currentPage * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = jobs.slice(startIndex, endIndex);

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleEditJob = (job: IJob) => {
    setSelectedJob(job);
    setIsEditPopUpOpen(true);
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
    if (job.status === "Closed") {
      return;
    }

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

  if (!jobs || jobs.length === 0) {
    return <div>No jobs available</div>;
  }

  const jobListStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  };

  const jobCardStyle = {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "16px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const buttonContainerStyle = {
    marginTop: "auto", // Ensure buttons are at the bottom
  };

  const buttonStyle = {
    marginTop: "8px",
    width: "100%",
    color: "#fff",
  };

  const buttonColors = {
    view: "#007bff",
    edit: "#ffc107",
    close: "#dc3545",
  };

  return (
    <JobActionsProvider>
      <div className="w-full max-w-5xl mx-auto px-4">
        <div style={jobListStyle}>
          {currentJobs.map((job) =>
            role === "employee" ? (
              <div key={job._id} style={jobCardStyle as any}>
                <JobCard job={job} />
                <div style={buttonContainerStyle}>
                  <button
                    onClick={() => handleOpenPopUp(job)}
                    style={{
                      ...buttonStyle,
                      backgroundColor: buttonColors.view,
                    }}
                  >
                    View Applications
                  </button>
                  <button
                    onClick={() => handleEditJob(job)}
                    style={{
                      ...buttonStyle,
                      backgroundColor: buttonColors.edit,
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleCloseJob(job)}
                    style={{
                      ...buttonStyle,
                      backgroundColor:
                        job.status === "Closed"
                          ? "#6c757d"
                          : buttonColors.close,
                      cursor:
                        job.status === "Closed" ? "not-allowed" : "pointer",
                    }}
                    disabled={job.status === "Closed"}
                  >
                    Close Job
                  </button>
                </div>
              </div>
            ) : (
              <CandidateJobCard key={job._id} job={job} />
            )
          )}
        </div>

        {role === "employee" && isPopUpOpen && selectedJob && (
          <JobEmployeePopUp
            job={selectedJob}
            applications={jobApplications}
            onClose={handleClosePopUp}
            onUpdateStatus={(applicationId) => {
              handleSendJob(applicationId);
            }}
          />
        )}

        {role === "employee" && isEditPopUpOpen && selectedJob && (
          <EditJobForm
            job={selectedJob}
            onClose={handleClosePopUp}
            onUpdate={handleJobUpdate}
          />
        )}
      </div>

      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={Math.ceil(jobs.length / jobsPerPage)}
        onPageChange={handlePageClick}
        containerClassName={"pagination flex justify-center mt-8"}
        pageClassName={"mx-2"}
        activeClassName={"text-blue-500 font-bold"}
        previousClassName={"mx-2"}
        nextClassName={"mx-2"}
        disabledClassName={"text-gray-400"}
      />
    </JobActionsProvider>
  );
};

export default JobList;
