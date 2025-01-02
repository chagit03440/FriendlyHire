"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers, deleteUser, getUser } from "@/app/services/userServices";
import IUser from "@/app/types/user";
import ProfilePage from "@/app/components/profile/Profile";
import { useRouter } from "next/navigation";
import ICandidate from "@/app/types/candidate";
import IEmployee from "@/app/types/employee";
import LoadSpinner from "@/app/components/common/LoadSpinner";
import { FaPlus } from "react-icons/fa";

const Page = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // Modal state
  const [selectedUser, setSelectedUser] = useState<
    (IUser & ICandidate) | (IUser & IEmployee) | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Separate users into candidates and employees
  const candidates = users.filter((user) => user.role === "candidate") as (IUser & ICandidate)[];
  const employees = users.filter((user) => user.role === "employee") as (IUser & IEmployee)[];

  const handleAddUser = () => {
    router.push("users/addUser");
  };

  const handleEditUser = async (user: IUser & (ICandidate | IEmployee)) => {
    const thisUser = await getUser(user.email);
    setSelectedUser(thisUser);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (mail: string) => {
    try {
      await deleteUser(mail); // Wait for deletion
      await queryClient.invalidateQueries({ queryKey: ["users"] }); // Trigger a refetch
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const closeModal = async () => {
    await queryClient.invalidateQueries({ queryKey: ["users"] }); // Trigger a refetch
    setIsModalOpen(false);
    setSelectedUser(null);
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
      {/* Header with Add User button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-black">Users Data</h2>
         {/* Add Job button */}
          <button
              onClick={handleAddUser}
              className="bg-orange-400 text-white p-3 rounded-full shadow-md hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
              title="Add a New User"
            >
              <FaPlus size={24} /> {/* Add icon */}
          </button>
      </div>

      {/* Candidates Table */}
      <section className="mb-8 overflow-x-auto">
        <h3 className="text-xl font-semibold text-black mb-4">Candidates</h3>
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-300 text-black">
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Email</th>
                <th className="border p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((user) => (
                <tr key={user.id} className="bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="border p-3">{user.name}</td>
                  <td className="border p-3">{user.email}</td>
                  <td className="border p-3 flex space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.email)}
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

      {/* Employees Table */}
      <section className="mb-8 overflow-x-auto">
        <h3 className="text-xl font-semibold text-black mb-4">Employees</h3>
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-300 text-black">
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Email</th>
                <th className="border p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((user) => (
                <tr key={user.id} className="bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="border p-3">{user.name}</td>
                  <td className="border p-3">{user.email}</td>
                  <td className="border p-3 flex space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.email)}
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

      {/* Profile Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-xl p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            
            {/* Add max-height and scroll functionality here */}
            <div className="max-h-[80vh] overflow-y-auto">
              <ProfilePage user={selectedUser} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
