"use client"
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
import ConfirmationModal from "@/app/components/admin/ConfirmationModal";

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

  const [selectedUser, setSelectedUser] = useState<
    (IUser & ICandidate) | (IUser & IEmployee) | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>("");
  const [deleteError, setDeleteError] = useState<string | undefined>(undefined);
  
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

  const handleDeleteUser = (user: IUser) => {
    const confirmationMessage =
      user.role === "candidate"
        ? "Deleting this candidate will also delete all the applications they have made. Are you sure?"
        : "Are you sure you want to delete this user?";
  
    setUserToDelete(user);
    setConfirmationMessage(confirmationMessage);
    setDeleteError(undefined);// Reset error message when starting the delete process
    setIsConfirmationOpen(true);
  };
  
  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        const result = await deleteUser(userToDelete.email);
        if (result.success) {
          await queryClient.invalidateQueries({ queryKey: ["users"] });
          setIsConfirmationOpen(false);
          setUserToDelete(null);
        } else {
          // Set the error message to be displayed in the modal
          setDeleteError(result.message);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        setDeleteError("An error occurred while deleting the user.");
      }
    }
  };

  const cancelDelete = () => {
    setIsConfirmationOpen(false);
    setUserToDelete(null);
    setDeleteError(undefined); // Reset error when canceling
  };

  const closeModal = async () => {
    await queryClient.invalidateQueries({ queryKey: ["users"] });
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-black">Users Data</h2>
        <button
          onClick={handleAddUser}
          className="bg-orange-400 text-white p-3 rounded-full shadow-md hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
          title="Add a New User"
        >
          <FaPlus size={24} />
        </button>
      </div>

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
                      onClick={() => handleDeleteUser(user)}
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
                      onClick={() => handleDeleteUser(user)}
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

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-xl p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <div className="max-h-[80vh] overflow-y-auto">
              <ProfilePage user={selectedUser} />
            </div>
          </div>
        </div>
      )}

      {isConfirmationOpen && userToDelete && (
        <ConfirmationModal
          message={confirmationMessage}
          errorMessage={deleteError} // Pass errorMessage to the modal
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default Page;
