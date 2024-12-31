"use client";
import { useRouter } from "next/navigation";
import { createJob } from "@/app/services/jobServices"; // Assumed service method
import { JobSchema } from "@/app/types/jobZod"; // Assumed Zod schema for validation
import { toast, Toaster } from "react-hot-toast";
import { useUser } from "@/app/store/UserContext";
import { useEffect, useState } from "react";
import checkAccess from "@/app/utils/checkAccess";
import LoadSpinner from "@/app/components/common/LoadSpinner";

const AddJob = () => {
  const noValidationErrors = {
    title: "",
    description: "",
    experience: "",
    company: "",
    requirements: "",
    location: "",
    status: "",
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [company, setCompany] = useState("");
  const [requirements, setRequirements] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<"Open" | "Closed">("Open");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [validationErrors, setValidationErrors] = useState(noValidationErrors);
  const [error, setError] = useState<string | null>(null);

  const { mail, role } = useUser();
  const router = useRouter();

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const userData = await checkAccess();
        if (!userData.hasAccess) {
          router.push("/pages/login");
        } else if (userData.role.toLowerCase() !== "employee" && userData.role.toLowerCase() !== "admin") {
          router.push("/pages/home");
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error(error);
        router.push("/pages/login");
      }
    };

    validateAccess();
  }, [router]);

  if (!isAuthenticated) {
    return <p><LoadSpinner/></p>;
  }

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

  const validateForm = () => {
    const parsed = JobSchema.safeParse(jobData);
    if (parsed.success) {
      setValidationErrors(noValidationErrors);
      return true;
    } else {
      const newErrors = { ...noValidationErrors };
      parsed.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof newErrors;
        newErrors[field] = err.message;
      });
      setValidationErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (validateForm()) {
        const response = await createJob(jobData);
        if (response) {
          toast.success("The job was added successfully!");
  
          setTimeout(() => {
            if (role === "admin") {
              router.push("/pages/home/admin/jobs");
            } else {
              router.push("/pages/home");
            }
          }, 2000); 
        } else {
          setError("There was an issue creating the job. Please try again.");
        }
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Toaster />
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-orange-500 mb-4">Post a New Job</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Title Input */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-white">
              Job Title
            </label>
            <input
              type="text"
              id="title"
              className={`w-full mt-1 p-2 border rounded-md ${
                validationErrors.title
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
              } text-gray-800`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {validationErrors.title && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
            )}
          </div>

          {/* Description Input */}
          <div className="mb-4 sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-white">
              Job Description
            </label>
            <textarea
              id="description"
              className={`w-full mt-1 p-2 border rounded-md ${
                validationErrors.description
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
              } text-gray-800`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
            />
            {validationErrors.description && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
            )}
          </div>

          {/* Experience Input */}
          <div className="mb-4">
            <label htmlFor="experience" className="block text-sm font-medium text-white">
              Years of Experience Required
            </label>
            <input
              type="number"
              id="experience"
              className={`w-full mt-1 p-2 border rounded-md ${
                validationErrors.experience
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
              } text-gray-800`}
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
              min="0"
            />
            {validationErrors.experience && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.experience}</p>
            )}
          </div>

          {/* Company Input */}
          <div className="mb-4">
            <label htmlFor="company" className="block text-sm font-medium text-white">
              Company Name
            </label>
            <input
              type="text"
              id="company"
              className={`w-full mt-1 p-2 border rounded-md ${
                validationErrors.company
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
              } text-gray-800`}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
            {validationErrors.company && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.company}</p>
            )}
          </div>

          {/* Requirements Input */}
          <div className="mb-4 sm:col-span-2">
            <label htmlFor="requirements" className="block text-sm font-medium text-white">
              Job Requirements (comma-separated)
            </label>
            <input
              type="text"
              id="requirements"
              className={`w-full mt-1 p-2 border rounded-md ${
                validationErrors.requirements
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
              } text-gray-800`}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="e.g. JavaScript, React, Node.js"
              required
            />
            {validationErrors.requirements && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.requirements}</p>
            )}
          </div>

          {/* Location Input */}
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-white">
              Job Location
            </label>
            <input
              type="text"
              id="location"
              className={`w-full mt-1 p-2 border rounded-md ${
                validationErrors.location
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
              } text-gray-800`}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            {validationErrors.location && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.location}</p>
            )}
          </div>

          {/* Status Input */}
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-white">
              Job Status
            </label>
            <select
              id="status"
              className={`w-full mt-1 p-2 border rounded-md ${
                validationErrors.status
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
              } text-gray-800`}
              value={status}
              onChange={(e) => setStatus(e.target.value as "Open" | "Closed")}
              required
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
            {validationErrors.status && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.status}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddJob;
