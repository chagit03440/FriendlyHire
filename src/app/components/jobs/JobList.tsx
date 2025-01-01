import React, { useEffect, useState } from "react";
import IJob from "@/app/types/job";
import { useUser } from "../../store/UserContext";
import {
  JobActionsProvider,
  useJobActions,
} from "../../store/JobActionsContext";
import SearchBar from "./SearchBar";
import EmployeeJobCard from "./EmployeeJobCard";
import CandidateJobCard from "./CandidateJobCard";
import JobEmployeePopUp from "../applications/JobEmployeePopUp";
import EditJobForm from "../employee/EditJobForm ";
import Pagination from "./Pagination";
import { useJobList } from "./useJobList";
import { getUser } from "@/app/services/userServices";
import { calculateSkillsMatch } from "../candidate/calculateSkillsMatch";
import { boolean } from "zod";

interface IUser {
  skills: string[];
  experience: number;
}

interface JobListProps {
  jobs: IJob[];
}

const JobList: React.FC<JobListProps> = ({ jobs: initialJobs }) => {
  const { role, mail } = useUser();
  const { handleSendJob } = useJobActions();
  const [user, setUser] = useState<IUser | null>(null);
  const {
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
  } = useJobList(initialJobs);

  const jobsPerPage = 6;

  // Fetch user data for candidates
  useEffect(() => {
    if (role === "candidate") {
      const fetchUserData = async () => {
        const fetchedUser = await getUser(mail as string);
        setUser(fetchedUser);
      };
      fetchUserData();
    }
  }, [mail, role]);

  // Calculate match percentage for candidates
  const calculateMatchPercentage = (job: IJob) => {
    if (!user) return { matchPercentage: 0, missingSkills: [] };

    const { matchPercentage: skillsMatchPercentage, missingSkills } =
      calculateSkillsMatch(user.skills, job.requirements);

    let matchPercentage = skillsMatchPercentage;
    const experienceDiff = job.experience - user.experience;

    if (experienceDiff > 0) {
      if (experienceDiff === 1) matchPercentage *= 0.8;
      else if (experienceDiff === 2) matchPercentage *= 0.5;
      else matchPercentage *= 0.2;
    } else {
      matchPercentage *= 1.2;
      if (matchPercentage > 100) matchPercentage = 100;
    }

    // Round to 2 decimal places
    return {
      matchPercentage: Number(matchPercentage.toFixed(2)),
      missingSkills,
    };
  };

  // First filter the jobs based on search query
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Then enrich the filtered jobs with matchPercentage and missingSkills for candidates
  const enrichedJobs =
    role === "candidate"
      ? filteredJobs.map((job) => {
        const { matchPercentage, missingSkills } =
          calculateMatchPercentage(job);
        // Treat candidates without skills as employees
        if (user?.skills !== undefined && user?.skills.length > 0) {
          return {
            ...job,
            matchPercentage,
            missingSkills,
          };
        } else return job; // Skip adding matchPercentage or missingSkills
      })
      : filteredJobs;

  // Finally sort the enriched jobs by matchPercentage
  const sortedJobs =
    role === "candidate"
      ? [...enrichedJobs].sort(
          (a, b) => b.matchPercentage! - a.matchPercentage!
        )
      : enrichedJobs;

  const totalPageCount = Math.ceil(sortedJobs.length / jobsPerPage);
  const currentJobs = sortedJobs.slice(
    currentPage * jobsPerPage,
    (currentPage + 1) * jobsPerPage
  );

  // Handle page change with scroll to top
  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!jobs || jobs.length === 0) {
    return <div>No jobs available</div>;
  }

  return (
    <JobActionsProvider>
      <div className="w-full max-w-5xl mx-auto px-4">
        <SearchBar
          value={searchQuery}
          onChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(0);
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentJobs.map((job) =>
            role === "employee" || role === "admin" ? (
              <EmployeeJobCard
                key={job._id}
                job={job as IJob}
                onView={handleOpenPopUp}
                onEdit={(job) => {
                  setSelectedJob(job);
                  setIsEditPopUpOpen(true);
                }}
                onClose={handleCloseJob}
              />
            ) : role === "candidate" ? (
              <CandidateJobCard
                key={job._id}
                job={job as IJob}
                onJobAction={handleJobAction}
                hasSkills={
                  user?.skills !== undefined && user?.skills.length > 0
                }
              />
            ) : null
          )}
        </div>

        {(role === "employee" || role === "admin") &&
          isPopUpOpen &&
          selectedJob && (
            <JobEmployeePopUp
              job={selectedJob}
              applications={jobApplications}
              onClose={handleClosePopUp}
              onUpdateStatus={handleSendJob}
            />
          )}

        {(role === "employee" || role === "admin") &&
          isEditPopUpOpen &&
          selectedJob && (
            <EditJobForm
              job={selectedJob}
              onClose={handleClosePopUp}
              onUpdate={handleJobUpdate}
            />
          )}

        <Pagination
          pageCount={totalPageCount}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </JobActionsProvider>
  );
};

export default JobList;
