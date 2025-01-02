import React from "react";
import { FaTimes } from "react-icons/fa";
import IJob from "@/app/types/job";

interface JobDetailsPopupProps {
  job: IJob | null;
  isOpen: boolean;
  onClose: () => void;
}

const JobDetailsPopup: React.FC<JobDetailsPopupProps> = ({ job, isOpen, onClose }) => {
  if (!isOpen || !job) return null;

  // Function to determine the status color
  const getStatusColor = (status: string) => {
    if (status === "Open") return "text-green-500";
    if (status === "Closed") return "text-red-500";
    return "text-gray-600"; // Default color if no status or invalid status
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900"
        >
          <FaTimes className="text-lg" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Job Details</h2>
        <div className="max-h-[60vh] overflow-y-auto space-y-4">
          <div>
            <h3 className="text-lg font-medium text-orange-500">Title:</h3>
            <p className="text-gray-600">{job.title || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-orange-500">Company:</h3>
            <p className="text-gray-600">{job.company || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-orange-500">Location:</h3>
            <p className="text-gray-600">{job.location || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-orange-500">Description:</h3>
            <p className="text-gray-600 whitespace-pre-line">{job.description || "N/A"}</p>
          </div>
          {/* Experience Requirement */}
          <div>
            <h3 className="text-lg font-medium text-orange-500">Experience Required:</h3>
            <p className="text-gray-600">{job.experience ? `${job.experience} years` : "N/A"}</p>
          </div>
          {/* Job Status */}
          <div>
            <h3 className="text-lg font-medium text-orange-500">Status:</h3>
            <p className={`text-lg ${getStatusColor(job.status)}`}>
              {job.status || "N/A"}
            </p>
          </div>
          {/* Requirements */}
          <div>
            <h3 className="text-lg font-medium text-orange-500">Requirements:</h3>
            <ul className="text-gray-600">
              {job.requirements && job.requirements.length > 0 ? (
                job.requirements.map((req, index) => (
                  <li key={index} className="list-disc pl-5">{req}</li>
                ))
              ) : (
                <li>N/A</li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPopup;
