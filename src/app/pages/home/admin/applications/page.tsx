"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import EditApplicationForm from "@/app/components/admin/EditApplicationForm";
import {
  deleteApplication,
  getApplicationById,
  getApplications,
} from "@/app/services/applicationServices";
import IApplication from "@/app/types/application";
import LoadSpinner from "@/app/components/common/LoadSpinner";

const Page = () => {
  const queryClient = useQueryClient();

  const {
    data: applications = [],
    isLoading,
    error,
  } = useQuery<IApplication[]>({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  // Modal state
  const [selectedApplication, setSelectedApplication] = useState<IApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditApplication = async (application: IApplication) => {
    const thisApplication = await getApplicationById(application._id);
    setSelectedApplication(thisApplication);
    setIsModalOpen(true);
  };

  const handleDeleteApplication = async (application: IApplication) => {
    try {
      await deleteApplication(application._id); // Wait for deletion
      await queryClient.invalidateQueries({ queryKey: ["applications"] }); // Trigger a refetch
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  const closeModal = async () => {
    await queryClient.invalidateQueries({ queryKey: ["applications"] }); // Trigger a refetch
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <LoadSpinner />
      </div>
    );
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-gray-100 text-black p-8 rounded-lg shadow-xl">
      <h2 className="text-3xl font-semibold text-black mb-6">Applications Data</h2>
      
      {/* Applications Table */}
      <section className="mb-8 overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-300 text-black">
                <th className="border p-3 text-left">UserEmail</th>
                <th className="border p-3 text-left">Title</th>
                <th className="border p-3 text-left">Company</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">ResumeUrl</th>
                <th className="border p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application._id} className="bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="border p-3 text-black">{application.userEmail}</td>
                  <td className="border px-4 py-3 text-black">
                    {typeof application.jobId === "object" && "title" in application.jobId
                      ? application.jobId.title
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-3 text-black">
                    {typeof application.jobId === "object" && "company" in application.jobId
                      ? application.jobId.company
                      : "N/A"}
                  </td>
                  <td className="border p-3 text-black">
                    <span
                      className={`${
                        application.status === "Saved"
                          ? "text-orange-400"
                          : application.status === "Applied"
                          ? "text-gray-500"
                          : application.status === "Sent"
                          ? "text-gray-500"
                          : application.status === "Archived"
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      {application.status}
                    </span>
                  </td>
                  <td className="border p-3 text-black max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                    {application.fileUrl}
                  </td>
                  <td className="border p-3 flex space-x-2">
                    <button
                      onClick={() => handleEditApplication(application)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteApplication(application)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Application Modal */}
      {isModalOpen && selectedApplication && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-3xl p-8 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <EditApplicationForm
              application={selectedApplication}
              onClose={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
