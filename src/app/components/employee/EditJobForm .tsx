import { useState, useEffect } from "react";
import { FaSave, FaMinus, FaPlus } from "react-icons/fa"; // Import icons
import toast , { Toaster } from "react-hot-toast";
import IJob from "@/app/types/job";

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
    setJobDetails((prev) => ({
      ...prev,
      [name]: name === "experience" ? (value === "" ? "" : Number(value)) : value,
    } as IJob));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(jobDetails);
    toast.success("Succesfully update job!");
    onClose();
  };

  return (
    <>
      <Toaster />
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-full overflow-y-auto relative">
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 p-1 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400"
              aria-label="Close"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-6 text-center">Edit Job</h2>
            <form onSubmit={handleSubmit} className="flex gap-6">
              {/* Left Column */}
              <div className="flex-1 space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    name="title"
                    id="title"
                    value={jobDetails.title}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <input
                    name="company"
                    id="company"
                    value={jobDetails.company}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    name="location"
                    id="location"
                    value={jobDetails.location}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Experience (Years)
                  </label>
                  <input
                    name="experience"
                    id="experience"
                    type="number"
                    min={0}
                    value={jobDetails.experience}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={jobDetails.status}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Requirements</label>
                <div className="space-y-2">
                  {(jobDetails.requirements || []).map((requirement, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) => handleArrayChange(e, index)}
                        className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(index)}
                        className="p-2 bg-gray-300 text-orange-500 rounded-md hover:bg-gray-400"
                      >
                        <FaMinus />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddRequirement}
                  className="mt-4 px-4 py-2 text-orange-500 rounded-md hover:bg-gray-400 flex items-center gap-2"
                >
                  <FaPlus /> Add Requirement
                </button>
              </div>
          </form>
          {/* Buttons */}
          <div className="mt-6 flex justify-between gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center gap-2"
              >
                <FaSave /> Save Changes
              </button>
            </div>
        </div>
      </div>
    </>
  );
};

export default EditJobForm;
