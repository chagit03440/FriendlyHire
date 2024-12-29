import React, { useState, useEffect } from "react";
import IJob from "@/app/types/job";
import { getUser } from "@/app/services/userServices"; // Adjust the path as necessary

interface JobCardProps {
  job: IJob;
  missingSkills?: string[];
}

const JobCard: React.FC<JobCardProps> = ({ job, missingSkills }) => {
  const [showDescription, setShowDescription] = useState(false);
  const [creatorName, setCreatorName] = useState<string | null>(null); // State for creator's name

  useEffect(() => {
    const fetchCreatorName = async () => {
      try {
        const user = await getUser(job.createdBy);
        setCreatorName(user?.name || "Unknown"); // Fallback to "Unknown" if no name is found
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

  const getRequirementStyle = (requirement: string) => {
    const baseStyle = {
      backgroundColor: "#f8f9fa",
      borderRadius: "4px",
      padding: "5px 10px",
      margin: "5px 0",
      fontSize: "12px",
      width: "calc(50% - 10px)",
      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    };

    // Only apply color styling if missingSkills is defined
    if (missingSkills) {
      return {
        ...baseStyle,
        backgroundColor: missingSkills.includes(requirement)
          ? "#ffebeb" // very light red for missing skills
          : "#eaffea", // very light green for matching skills
      };
    }

    return baseStyle;
  };

  return (
    <div className="border p-6 rounded-lg shadow-lg bg-white w-full flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-bold text-indigo-700">{job.title}</h3>
        <p className="text-md text-gray-500 mb-2">{job.company}</p>
        <div className="mb-4">
          <button
            className="text-blue-500 underline"
            onClick={toggleDescription}
          >
            {showDescription ? "Hide Description" : "Show Description"}
          </button>
          {showDescription && (
            <p className="text-gray-700 mt-2 mb-4">{job.description}</p>
          )}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Experience Required:</span>{" "}
          {job.experience} {job.experience === 1 ? "year" : "years"}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Location:</span> {job.location}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Requirements:</span>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "flex-start",
            }}
          >
            {job.requirements.length > 0
              ? job.requirements.map((req, index) => (
                  <div key={index} style={getRequirementStyle(req)}>
                    {req}
                  </div>
                ))
              : null}
          </div>
        </div>
        <div className="text-left text-sm text-gray-400 mt-auto">
          <span className="font-semibold">Posted by:</span>{" "}
          {creatorName || "Loading..."} {/* Display creator's name */}
        </div>
      </div>
    </div>
  );
};

export default JobCard;