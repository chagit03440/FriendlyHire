import React, { useState } from "react";
import IJob from "../types/job";

interface JobCardProps {
  job: IJob;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [showDescription, setShowDescription] = useState(false);

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  const requirementsStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "flex-start", // Align to the left (or center if preferred)
  };

  const requirementItemStyle = {
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    padding: "5px 10px",
    margin: "5px 0",
    fontSize: "12px", // Smaller font size
    width: "calc(50% - 10px)", // Forces two items per row with space for the gap
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)", // Optional, adds a subtle shadow
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
          <div style={requirementsStyle as any}>
            {job.requirements.length > 0
              ? job.requirements.map((req, index) => (
                  <div key={index} style={requirementItemStyle}>
                    {req}
                  </div>
                ))
              : null}
          </div>
        </div>

        <div className="mb-4">
          <span className="font-semibold">Status:</span> {job.status}
        </div>
      </div>

      <div className="text-right text-sm text-gray-400 mt-auto">
        <span className="font-semibold">Posted by:</span> {job.createdBy}
      </div>
    </div>
  );
};

export default JobCard;
