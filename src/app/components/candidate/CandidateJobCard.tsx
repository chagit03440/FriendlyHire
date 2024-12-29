import React, { useState, useEffect } from "react";
import IJob from "../../types/job";
import JobCard from "../applications/JobCard";
import { useJobActions } from "@/app/store/JobActionsContext";
import { useUser } from "@/app/store/UserContext";
import { getUser } from "@/app/services/userServices";
import { calculateSkillsMatch } from "./calculateSkillsMatch";

interface IUser {
  skills: string[];
  experience: number;
}

interface CandidateJobCardProps {
  job: IJob;
  onJobAction: (jobId: string) => void;
  onMatchPercentageUpdate: (matchPercentage: number) => void;
}

const CandidateJobCard: React.FC<CandidateJobCardProps> = ({
  job,
  onJobAction,
  onMatchPercentageUpdate,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const { handleSaveJob, handleApplyJob } = useJobActions();
  const { mail } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedUser = await getUser(mail as string);
      setUser(fetchedUser);
    };
    fetchUserData();
  }, [mail]);

  useEffect(() => {
    if (user) {
      const { matchPercentage: skillsMatchPercentage } = calculateSkillsMatch(
        user.skills,
        job.requirements
      );

      let finalMatchPercentage = skillsMatchPercentage;
      const experienceDiff = job.experience - user.experience;

      if (experienceDiff > 0) {
        if (experienceDiff === 1) finalMatchPercentage *= 0.8;
        else if (experienceDiff === 2) finalMatchPercentage *= 0.5;
        else finalMatchPercentage *= 0.2;
      } else {
        finalMatchPercentage *= 1.2;
        if (finalMatchPercentage > 100) finalMatchPercentage = 100;
      }

      // Format to 2 decimal places before sending to parent
      const formattedMatchPercentage = Number(finalMatchPercentage.toFixed(2));
      onMatchPercentageUpdate(formattedMatchPercentage);
    }
  }, [user, job, onMatchPercentageUpdate]);

  if (!user) {
    return <div>Loading...</div>;
  }

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

  // Format matchPercentage to 2 decimal places for display
  const displayMatchPercentage = Number(matchPercentage.toFixed(2));

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const onSaveJob = () => {
    handleSaveJob(job._id);
    setIsSaved(true);
    onJobAction(job._id);
  };

  const onApplyJob = () => {
    handleApplyJob(job._id);
    onJobAction(job._id);
  };

  return (
    <div className="border p-4 rounded-lg shadow-lg bg-white">
      <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center gap-4">
        <div className="flex-1 relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full transition-all duration-500 ${getMatchColor(
              displayMatchPercentage
            )}`}
            style={{ width: `${displayMatchPercentage}%` }}
          />
        </div>
        <div className="text-sm text-gray-600 font-medium whitespace-nowrap">
          {displayMatchPercentage}% Match
        </div>
      </div>
      <JobCard job={job} missingSkills={missingSkills} />
      <div className="flex justify-between mt-4 gap-4">
        <button
          onClick={onSaveJob}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 ${
            isSaved
              ? "bg-gray-200 text-gray-600"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          disabled={isSaved}
        >
          {isSaved ? "Saved" : "Save Job"}
        </button>
        <button
          onClick={onApplyJob}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default CandidateJobCard;
