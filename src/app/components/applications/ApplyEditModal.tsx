import React from "react";

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
        <p className="text-gray-600 mb-6">
          Would you like to edit your resume before applying for this job?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onEditResume}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Edit Resume
          </button>
          <button
            onClick={onApplyNow}
            disabled={loading} // Disable button while loading
            className={`px-4 py-2 rounded-lg ${
              loading
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {loading ? "Applying..." : "Apply Now"} {/* Update button text */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyEditModal;
