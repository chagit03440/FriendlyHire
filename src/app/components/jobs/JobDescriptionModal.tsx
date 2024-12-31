import React from "react";

interface JobDescriptionModalProps {
  title: string;
  description: string;
  onClose: () => void;
}

const JobDescriptionModal: React.FC<JobDescriptionModalProps> = ({
  title,
  description,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg border border-gray-300 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-semibold"
        >
          &times;
        </button>

        {/* Title */}
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h3>

        {/* Scrollable Description */}
        <div className="max-h-96 overflow-y-auto">
          <p className="text-gray-800">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionModal;
