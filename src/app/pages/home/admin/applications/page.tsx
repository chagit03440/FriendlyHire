// "use client";
// import React, { useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { getUsers, deleteUser, getUser } from "@/app/services/userServices";
// import IUser from "@/app/types/user";
// import ProfilePage from "@/app/components/Profile";
// import { useRouter } from "next/navigation";
// import ICandidate from "@/app/types/candidate";
// import IEmployee from "@/app/types/employee";
// import { getApplications } from "@/app/services/applicationServices";
// import IApplication from "@/app/types/application";

// const Page = () => {
//     const router = useRouter();
//     const queryClient = useQueryClient();

    
//     const { data: applications = [], isLoading, error } = useQuery<IUser[]>({
//         queryKey: ["applications"],
//         queryFn: getApplications,
//     });

//     // Modal state
//     const [selectedApplication, setSelectedApplication] =useState<IApplication| null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);

    
//     const handleAddApplication = () => {
//         router.push("users/addApplication");
//     };

//     const handleEditUser = async (application: IApplication) => {
//         const thisApplication = await getUser(user.email);
//         console.log("user",thisUser);
//         setSelectedUser(thisUser);
//         setIsModalOpen(true);
//     };

    
//     const handleDeleteUser = async (mail: string) => {
//         try {
//             await deleteUser(mail); // Wait for deletion
//             await queryClient.invalidateQueries({queryKey:["users"]}); // Trigger a refetch
//         } catch (error) {
//             console.error("Error deleting user:", error);
//         }
//     };
    

//     const closeModal = async () => {

//         await queryClient.invalidateQueries({queryKey:["users"]}); // Trigger a refetch
        
//         setIsModalOpen(false);
//         setSelectedUser(null);
//     };

//     if (isLoading) return <div>Loading...</div>;
//     if (error instanceof Error) return <div>Error: {error.message}</div>;

//     return (
//         <div className="p-4">
//         <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

//         {/* Add User Button */}
//         <div className="mb-6">
//             <button
//             onClick={handleAddUser}
//             className="bg-green-500 text-white px-4 py-2 rounded"
//             >
//             Add User
//             </button>
//         </div>

//         {/* Candidates Table */}
//         <section className="mb-8">
//             <h2 className="text-xl font-semibold mb-4">Candidates</h2>
//             <table className="min-w-full bg-white border border-gray-200">
//             <thead>
//                 <tr>
//                 <th className="border p-2 text-left">Name</th>
//                 <th className="border p-2 text-left">Email</th>
//                 <th className="border p-2 text-left">Actions</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {candidates.map((user) => (
//                 <tr key={user.id}>
//                     <td className="border p-2">{user.name}</td>
//                     <td className="border p-2">{user.email}</td>
//                     <td className="border p-2 flex">
//                     <button
//                         onClick={() => handleEditUser(user)}
//                         className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
//                     >
//                         Edit
//                     </button>
//                     <button
//                         onClick={() => handleDeleteUser(user.email)}
//                         className="bg-red-500 text-white px-2 py-1 rounded"
//                     >
//                         Delete
//                     </button>
//                     </td>
//                 </tr>
//                 ))}
//             </tbody>
//             </table>
//         </section>

//         {/* Employees Table */}
//         <section>
//             <h2 className="text-xl font-semibold mb-4">Employees</h2>
//             <table className="min-w-full bg-white border border-gray-200">
//             <thead>
//                 <tr>
//                 <th className="border p-2 text-left">Name</th>
//                 <th className="border p-2 text-left">Email</th>
//                 <th className="border p-2 text-left">Actions</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {employees.map((user) => (
//                 <tr key={user.id}>
//                     <td className="border p-2">{user.name}</td>
//                     <td className="border p-2">{user.email}</td>
//                     <td className="border p-2 flex">
//                     <button
//                         onClick={() => handleEditUser(user)}
//                         className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
//                     >
//                         Edit
//                     </button>
//                     <button
//                         onClick={() => handleDeleteUser(user.email)}
//                         className="bg-red-500 text-white px-2 py-1 rounded"
//                     >
//                         Delete
//                     </button>
//                     </td>
//                 </tr>
//                 ))}
//             </tbody>
//             </table>
//         </section>

//         {/* Profile Modal */}
//         {isModalOpen && selectedUser && (
//             <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//             <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-xl p-6 relative">
//                 <button
//                 onClick={closeModal}
//                 className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
//                 >
//                 ✕
//                 </button>
//                 <ProfilePage user={selectedUser} />
//             </div>
//             </div>
//         )}
//         </div>
//     );
//     };

// export default Page;