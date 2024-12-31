import React, { useState, useEffect } from "react";
import IJob from "@/app/types/job";
import { getUser } from "@/app/services/userServices";

interface JobCardProps {
  job: IJob;
  missingSkills?: string[];
}

const JobCard: React.FC<JobCardProps> = ({ job, missingSkills }) => {
  const [showDescription, setShowDescription] = useState(false);
  const [creatorName, setCreatorName] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreatorName = async () => {
      try {
        const user = await getUser(job.createdBy);
        setCreatorName(user?.name || "Unknown");
      } catch (error) {
        console.error("Failed to fetch creator's name:", error);
        setCreatorName("Error fetching name");
      }
    };

    fetchCreatorName();
  }, [job.createdBy]);

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  return (
    <div className="border border-gray-300 p-6 rounded-lg shadow-lg bg-white w-full flex flex-col space-y-4 hover:shadow-xl transition-shadow duration-300 ease-in-out h-full">
      <div>
        <h3 className="text-2xl font-semibold text-black">{job.title}</h3>
        <p className="text-lg text-gray-700">{job.company}</p>
      </div>

      <div>
        <button
          onClick={toggleDescription}
          className="text-indigo-600 hover:text-indigo-700 font-medium focus:outline-none"
        >
          {showDescription ? "Hide Description" : "Show Description"}
        </button>
        {showDescription && (
          <p className="text-gray-800 mt-2 break-words">{job.description}</p>
        )}
      </div>

      <div className="text-gray-700">
        <span className="font-semibold text-gray-600">
          Experience Required:
        </span>{" "}
        {job.experience
          ? `${job.experience} ${job.experience === 1 ? "year" : "years"}`
          : "Not specified"}
      </div>

      <div className="text-gray-700">
        <span className="font-semibold text-gray-600">Location:</span>{" "}
        {job.location || "Not specified"}
      </div>

      <div>
        <span className="font-semibold text-gray-700">Requirements:</span>
        <div className="flex flex-wrap gap-3 mt-3">
          {job.requirements.length > 0 ? (
            job.requirements.map((req, index) => (
              <span
                key={index}
                className={`px-4 py-2 text-sm rounded-full font-medium ${
                  missingSkills
                    ? missingSkills.includes(req)
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {req}
              </span>
            ))
          ) : (
            <span className="text-gray-500 italic">No requirements listed</span>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-4">
        <span className="font-semibold text-gray-700">Posted by:</span>{" "}
        {creatorName || "Loading..."}
      </div>
    </div>
  );
};

export default JobCard;
