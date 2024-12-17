"use client"
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, deleteUser } from "@/app/services/userServices";
import IUser from "@/app/types/user";
import { useRouter } from "next/navigation";

const Page = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch users using useQuery
  const { data: users = [], isLoading, error } = useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // Separate users into candidates and employees
  const candidates = users.filter((user) => user.role === "candidate");
  const employees = users.filter((user) => user.role === "employee");

  // Handle adding a user (navigate to signup page)
  const handleAddUser = () => {
    router.push("/pages/signup");
  };

  // Handle editing a user (navigate to profile page with user ID)
  const handleEditUser = (id: number) => {
    router.push(`/profile/${id}`);
  };

  // Handle deleting a user
  const handleDeleteUser = (id: number) => {
    deleteUser(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Add User Button */}
      <div className="mb-6">
        <button
          onClick={handleAddUser}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add User
        </button>
      </div>

      {/* Candidates Table */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Candidates</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((user) => (
              <tr key={user.id}>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2 flex">
                  <button
                    onClick={() => handleEditUser(user.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
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

      {/* Employees Table */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Employees</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((user) => (
              <tr key={user.id}>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2 flex">
                  <button
                    onClick={() => handleEditUser(user.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
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
    </div>
  );
};

export default Page;
