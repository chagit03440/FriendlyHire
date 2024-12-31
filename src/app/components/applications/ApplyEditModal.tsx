import React from "react";
import { FaTimes, FaEdit, FaPaperPlane } from "react-icons/fa"; // Icons

interface ApplyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyNow: () => void;
  onEditResume: () => void;
  loading: boolean; // Add a loading prop
}

const ApplyEditModal: React.FC<ApplyEditModalProps> = ({
  isOpen,
  onClose,
  onApplyNow,
  onEditResume,
  loading, // Use the loading state
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Apply for Job</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Would you like to edit your resume before applying for this job?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
          >
            <FaTimes className="text-base" />
            Cancel
          </button>
          <button
            onClick={onEditResume}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            <FaEdit className="text-base" />
            Edit Resume
          </button>
          <button
            onClick={onApplyNow}
            disabled={loading} // Disable button while loading
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              loading
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            <FaPaperPlane className="text-base" />
            {loading ? "Applying..." : "Apply Now"} {/* Update button text */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyEditModal;
