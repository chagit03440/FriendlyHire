import React, { useState } from "react";
import { ApplicationStatus } from "@/app/types/enums";
import IApplication from "@/app/types/application";
import { updateApplication } from "@/app/services/applicationServices";

interface EditApplicationFormProps {
  application: IApplication;
  onClose: () => void;
}

const EditApplicationForm: React.FC<EditApplicationFormProps> = ({ application, onClose }) => {
  const [formData, setFormData] = useState<IApplication>(application);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value } as IApplication);
  };

  const handleSave = async () => {
    try {
      await updateApplication(formData);
      setIsEditing(false);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Edit Application</h2>
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      <form className="space-y-4">
        <div>
          <label htmlFor="userEmail" className="block text-sm font-medium">
            User Email
          </label>
          <input
            type="email"
            id="userEmail"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded ${isEditing ? "bg-white" : "bg-gray-100"}`}
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded ${isEditing ? "bg-white" : "bg-gray-100"}`}
          >
            {Object.values(ApplicationStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="fileUrl" className="block text-sm font-medium">
            File URL
          </label>
          <input
            type="url"
            id="fileUrl"
            name="fileUrl"
            value={formData.fileUrl}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded ${isEditing ? "bg-white" : "bg-gray-100"}`}
          />
        </div>

        <div className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
              Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditApplicationForm;
