"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/app/services/userServices";
import IUser from "@/app/types/user";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [profile, setProfile] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const userData: IUser = { name, email, password, role, profile } as IUser;
  
    try {
      const response = await createUser(userData);
      if (response) {
        router.push(`/pages/home`);
      } else {
        setError("היה בעיה בהתחברות. נסה שוב.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">הרשמה</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="string"
              id="name"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              value={role}
              onChange={(e)=>setRole(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a role
              </option>
              <option value="Candidate">Candidate</option>
              <option value="Employee">Employee</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Profile
            </label>
            <input
              type="text"
              id="profile"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            הרשם
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
