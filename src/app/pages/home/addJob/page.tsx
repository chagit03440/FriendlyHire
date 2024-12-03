"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createJob } from "@/app/services/jobServices"; // Assumed service method
import { JobSchema } from "@/app/types/jobZod"; // Assumed Zod schema for validation
import { toast, Toaster } from "react-hot-toast";
import { useUser } from "@/app/context/UserContext";

const AddJob = () => {
  const { role, mail } = useUser();
  console.log(`role: ${role} mail: ${mail}`);

  // Initial state for no validation errors
  const noValidationErrors = {
    title: "",
    description: "",
    experience: "",
    company: "",
    requirements: "",
    location: "",
    status: "",
  };

  // State for form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [company, setCompany] = useState("");
  const [requirements, setRequirements] = useState("");
  const [location, setLocation] = useState("");
const [status, setStatus] = useState<"Open" | "Closed">("Open");

  // State for validation and error handling
  const [validationErrors, setValidationErrors] = useState(noValidationErrors);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const jobData = {
    title,
    description,
    experience: parseInt(experience),
    company,
    requirements: requirements.split(",").map((req) => req.trim()),
    location,
    status,
    createdBy: mail || "",
  };

  // Form validation function
  const validateForm = () => {
    console.log(`validateForm`);
    const parsed = JobSchema.safeParse(jobData);
    if (parsed.success) {
      setValidationErrors(noValidationErrors);
      console.log(`return true`);

      return true;
    } else {
      const newErrors = { ...noValidationErrors };
      parsed.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof newErrors;
        newErrors[field] = err.message;
      });
      setValidationErrors(newErrors);
      console.log(`return false`);

      return false;
    }
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    console.log(`handleSubmit`);
    e.preventDefault();
    try {
      if (validateForm()) {
        const response = await createJob(jobData);
        if (response) {
          toast.success("המשרה נוספה בהצלחה!");
          setTimeout(() => {
            router.push("/pages/home"); // Redirect after showing the toast
          }, 2000); // Wait for 2 seconds
        } else {
          setError("היתה בעיה ביצירת המשרה. נסה שוב.");
        }
      }
    } catch (error) {
      console.error(error);
      setError("אירעה שגיאה. אנא נסה שוב.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">פרסום משרה חדשה</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Job Title
            </label>
            <input
              type="text"
              id="title"
              className={`w-full mt-1 p-2 border rounded-md ${
                validationErrors.title
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {validationErrors.title && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.title}
              </p>
            )}
          </div>

          {/* Description Input */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Job Description
            </label>
            <textarea
              id="description"
              className={`w-full mt-1 p-2 border rounded-md ${
                validationErrors.description
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
            />
            {validationErrors.description && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.description}
              </p>
            )}
          </div>

          {/* Experience Input */}
          <div className="mb-4">
            <label
              htmlFor="experience"
              className="block text-sm font-medium text-gray-700"
            >
              Years of Experience Required
            </label>
            <input
              type="number"
              id="experience"
              className={`w-full mt-1 p-2 border rounded-md ${
                validationErrors.experience
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
              min="0"
            />
            {validationErrors.experience && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.experience}
              </p>
            )}
          </div>

          {/* Company Input */}
          <div className="mb-4">
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700"
            >
              Company Name
            </label>
            <input
              type="text"
              id="company"
              className={`w-full mt-1 p-2 border rounded-md ${
                validationErrors.company
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
            {validationErrors.company && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.company}
              </p>
            )}
          </div>

          {/* Requirements Input */}
          <div className="mb-4">
            <label
              htmlFor="requirements"
              className="block text-sm font-medium text-gray-700"
            >
              Job Requirements (comma-separated)
            </label>
            <input
              type="text"
              id="requirements"
              className={`w-full mt-1 p-2 border rounded-md ${
                validationErrors.requirements
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="e.g. JavaScript, React, Node.js"
              required
            />
            {validationErrors.requirements && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.requirements}
              </p>
            )}
          </div>

          {/* Location Input */}
          <div className="mb-4">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Job Location
            </label>
            <input
              type="text"
              id="location"
              className={`w-full mt-1 p-2 border rounded-md ${
                validationErrors.location
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            {validationErrors.location && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.location}
              </p>
            )}
          </div>

          {/* Status Input */}
          <div className="mb-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Job Status
            </label>
            <select
              id="status"
              className={`w-full mt-1 p-2 border rounded-md ${
                validationErrors.status
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              value={status}
              onChange={(e) => setStatus(e.target.value as "Open" | "Closed")}
              required
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
            {validationErrors.status && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.status}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            צור משרה
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddJob;
