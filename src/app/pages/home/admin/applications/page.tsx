"use client";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import EditApplicationForm from "@/app/components/admin/EditApplicationForm";
// import { useRouter } from "next/navigation";
import { deleteApplication, getApplicationById, getApplications } from "@/app/services/applicationServices";
import IApplication from "@/app/types/application";
import LoadSpinner from "@/app/components/LoadSpinner";

const Page = () => {
    //const router = useRouter();
    const queryClient = useQueryClient();

    
    const { data: applications = [], isLoading, error } = useQuery<IApplication[]>({
        queryKey: ["applications"],
        queryFn: getApplications,
    });

    // Modal state
    const [selectedApplication, setSelectedApplication] =useState<IApplication| null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    
    // const handleAddApplication = () => {
    //     router.push("applications/addApplication");
    // };

    const handleEditApplication = async (application: IApplication) => {
        const thisApplication = await getApplicationById(application._id);
        setSelectedApplication(thisApplication);
        setIsModalOpen(true);
    };

    
    const handleDeleteApplication = async (application: IApplication) => {
        try {
            await deleteApplication(application._id); // Wait for deletion
            await queryClient.invalidateQueries({queryKey:["applications"]}); // Trigger a refetch
        } catch (error) {
            console.error("Error deleting application:", error);
        }
    };
    

    const closeModal = async () => {

        await queryClient.invalidateQueries({queryKey:["applications"]}); // Trigger a refetch
        
        setIsModalOpen(false);
        setSelectedApplication(null);
    };

    if (isLoading) return <div><LoadSpinner/></div>;
    if (error instanceof Error) return <div>Error: {error.message}</div>;

    console.log("app",applications)
    return (
        <div className="p-4">
        {/* Add Application Button */}
        {/* <div className="mb-6">
            <button
            onClick={handleAddApplication}
            className="bg-green-500 text-white px-4 py-2 rounded"
            >
            Add Application
            </button>
        </div> */}
        {/* Aplications Table */}
        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Applications Data</h2>
            <table className="min-w-full bg-white border border-gray-200">
            <thead>
                <tr>
                <th className="border p-2 text-left">UserEmail</th>
                <th className="border p-2 text-left">Title</th>
                <th className="border p-2 text-left">Company</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-left">ResumeUrl</th>
                </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application._id}>
                  <td className="border p-2">{application.userEmail}</td>
                  <td className="border px-4 py-2">
                    {typeof application.jobId === "object" && "title" in application.jobId
                      ? application.jobId.title
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {typeof application.jobId === "object" && "company" in application.jobId
                      ? application.jobId.company
                      : "N/A"}
                  </td>
                  <td className="border p-2">{application.status}</td>
                  <td className="border p-2">{application.fileUrl}</td>
                  <td className="border p-2 flex">
                    <button
                      onClick={() => handleEditApplication(application)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteApplication(application)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
        </section>

        {/* Application Modal */}
        {isModalOpen && selectedApplication && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-xl p-6 relative">
                <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                >
                ✕
                </button>
                <EditApplicationForm 
                application={selectedApplication} 
                onClose={closeModal}/>
            </div>
            </div>
        )}
        </div>
    );
    };

export default Page;