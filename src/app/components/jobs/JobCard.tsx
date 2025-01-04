import React, { useState, useEffect } from "react";
import JobDescriptionModal from "./JobDescriptionModal";
import { getUser } from "@/app/services/userServices";

interface IJob {
  title: string;
  company: string;
  description: string;
  experience: number;
  location: string;
  requirements: string[];
  createdBy: string;
}

interface JobCardProps {
  job: IJob;
  missingSkills?: string[];
}

const JobCard: React.FC<JobCardProps> = ({ job, missingSkills }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  return (
    <div className="w-full h-[420px] rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
      {/* Header Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="space-y-1 text-center">
          <h3 className="text-xl font-bold text-black line-clamp-2 min-h-[3.5rem]">
            {job.title}
          </h3>
          <div className="flex items-center justify-center text-gray-800">
            <svg
              className="w-4 h-4 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="line-clamp-1">{job.company}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-grow">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-gray-800">
            <svg
              className="w-4 h-4 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm">
              {job.experience
                ? `${job.experience} ${job.experience === 1 ? "year" : "years"}`
                : "Not specified"}
            </span>
          </div>
          <div className="flex items-center text-gray-800 text-sm">
            <svg
              className="w-4 h-4 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="break-words line-clamp-2">
              {job.location || "Not specified"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-black text-sm">Required Skills:</h4>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {job.requirements.length > 0 ? (
              job.requirements.map((req, index) => (
                <span
                  key={index}
                  className={`px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 ${missingSkills?.includes(req)
                      ? "text-red-600 border border-red-300"
                      : missingSkills
                        ? "text-green-600 border border-green-300"
                        : "text-orange-400 border border-orange-300"
                    }`}
                >
                  {req}
                </span>
              ))
            ) : (
              <span className="text-gray-800 italic text-sm">
                No requirements listed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section with Posted By and Button */}
      <div className="px-4 py-2 border-t border-gray-200 mt-auto">
        <div className="flex items-center justify-between">
          <div className="text-gray-500">
            <div className="flex items-center">
              <svg
                className="w-2.5 h-2.5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-[9px]">
                Posted by:{" "}
                <span style={{ fontStyle: "italic" }}>
                  {creatorName || "Loading..."}
                </span>
              </span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-1 py-2 text-xs font-medium text-white bg-orange-400 rounded hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-colors duration-200"
            >
              View More Details
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <JobDescriptionModal
          title={job.title}
          description={job.description}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default JobCard;
