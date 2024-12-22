"use client";
import { createApplication } from "@/app/services/applicationServices"; // Ensure you have an addApplication service
import IApplication from "@/app/types/application";
import { ApplicationStatus } from "@/app/types/enums";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import React from 'react';

const Page = () => {
  const router = useRouter();

  const noValidationErrors = {
    userEmail: "",
    jobId: "",
    fileUrl: "",
    status: "",
  };

  const [userEmail, setUserEmail] = useState("");
  const [jobId, setJobId] = useState("");
  const [fileUrl, setFileUrl] = useState(""); // For resume file URL
  const [status, setStatus] = useState(ApplicationStatus.Saved); // Default status is "Saved"
  const [validationErrors, setValidationErrors] = useState(noValidationErrors);
  const [error, setError] = useState<string | null>(null);

  const applicationData = { userEmail, jobId, fileUrl, status };

  const validateForm = () => {
    // Example of simple validation, adjust as needed
    const errors = { ...noValidationErrors };
    let isValid = true;

    if (!userEmail) {
      errors.userEmail = "Email is required";
      isValid = false;
    }

    if (!jobId) {
      errors.jobId = "Job ID is required";
      isValid = false;
    }

    if (!fileUrl) {
      errors.fileUrl = "Resume file is required";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      // Handle file upload here (e.g., upload to server, then set the file URL)
      // For now, just simulate a URL
      setFileUrl(URL.createObjectURL(file)); // In real case, upload to server and get URL
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (validateForm()) {
        const response = await createApplication(applicationData); // Ensure this is implemented
        if (response) {
          toast.success("הגשת בקשה בהצלחה!");
          setTimeout(() => {
            router.back();
          }, 2000);
        } else {
          setError("היתה בעיה בהגשה. נסה שוב.");
        }
      }
    } catch (error) {
      console.error(error);
      setError("אירעה שגיאה. אנא נסה שוב.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-100 py-8">
      <Toaster />
      <div className="bg-white p-12 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-8">הגשת בקשה</h2>
        {error && <p className="text-red-500 text-center mb-6">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="userEmail" className="block text-md font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="userEmail"
              className={`w-full mt-1 p-3 border rounded-lg text-md ${
                validationErrors.userEmail ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
            {validationErrors.userEmail && <p className="text-red-500 text-sm mt-1">{validationErrors.userEmail}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="jobId" className="block text-md font-medium text-gray-700 mb-2">
              Job ID
            </label>
            <input
              type="text"
              id="jobId"
              className={`w-full mt-1 p-3 border rounded-lg text-md ${
                validationErrors.jobId ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              required
            />
            {validationErrors.jobId && <p className="text-red-500 text-sm mt-1">{validationErrors.jobId}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="fileUrl" className="block text-md font-medium text-gray-700 mb-2">
              Resume (PDF)
            </label>
            <input
              type="file"
              id="fileUrl"
              className={`w-full mt-1 p-3 border rounded-lg text-md ${
                validationErrors.fileUrl ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
              accept="application/pdf"
              onChange={handleFileUpload}
              required
            />
            {validationErrors.fileUrl && <p className="text-red-500 text-sm mt-1">{validationErrors.fileUrl}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="status" className="block text-md font-medium text-gray-700 mb-2">
              Application Status
            </label>
            <select
              id="status"
              className={`w-full mt-1 p-3 border rounded-lg text-md ${
                validationErrors.status ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
              value={status}
              onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
              required
            >
              <option value={ApplicationStatus.Saved}>Saved</option>
              <option value={ApplicationStatus.Applied}>Applied</option>
              <option value={ApplicationStatus.Sent}>Sent</option>
              <option value={ApplicationStatus.Archived}>Archived</option>
            </select>
            {validationErrors.status && <p className="text-red-500 text-sm mt-1">{validationErrors.status}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-8 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            הגש בקשה
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
