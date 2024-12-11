import { useState, useEffect } from "react";
import IJob from "../types/job";

interface EditJobFormProps {
  job: IJob;
  onClose: () => void;
  onUpdate: (updatedJob: IJob) => void;
}

const EditJobForm: React.FC<EditJobFormProps> = ({ job, onClose, onUpdate }) => {
  const [jobDetails, setJobDetails] = useState<IJob>({ ...job } as IJob);

  useEffect(() => {
    setJobDetails({ ...job } as IJob);
  }, [job]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setJobDetails({ ...jobDetails, [name]: value } as IJob);
  };
  

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedRequirements = [...(jobDetails.requirements || [])];
    updatedRequirements[index] = e.target.value;
    setJobDetails((prev) => ({ ...prev, requirements: updatedRequirements } as IJob));
  };

  const handleAddRequirement = () => {
    setJobDetails((prev) => ({
      ...prev,
      requirements: [...(prev.requirements || []), ""],
    } as IJob));
  };

  const handleRemoveRequirement = (index: number) => {
    const updatedRequirements = [...(jobDetails.requirements || [])];
    updatedRequirements.splice(index, 1);
    setJobDetails((prev) => ({ ...prev, requirements: updatedRequirements } as IJob));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(jobDetails); // Submit the updated job details
    onClose(); // Close the popup after submission
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-full overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Job</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              name="title"
              id="title"
              value={jobDetails.title}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={jobDetails.description}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
              Experience
            </label>
            <input
              name="experience"
              id="experience"
              type="number"
              value={jobDetails.experience}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Company
            </label>
            <input
              name="company"
              id="company"
              value={jobDetails.company}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              name="location"
              id="location"
              value={jobDetails.location}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              id="status"
              value={jobDetails.status}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Requirements</label>
            {(jobDetails.requirements || []).map((requirement, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => handleArrayChange(e, index)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveRequirement(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddRequirement}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Add Requirement
            </button>
          </div>
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobForm;
