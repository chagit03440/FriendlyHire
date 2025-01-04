import React from 'react';

interface ConfirmationModalProps {
  message: string;
  errorMessage?: string | null; // Allow `null` as well
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  message,
  errorMessage,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-xl p-6 relative">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-black mb-4">
            {errorMessage || message} {/* Show error message if exists */}
          </h3>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onConfirm}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Confirm
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
