"use client";
import { addUser } from "@/app/services/userServices";
import IUser from "@/app/types/user";
import { UserSchema } from "@/app/types/userZod";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import React from 'react'

const page = () => {
    const router = useRouter();

    const noValidationErrors = {
        name: "",
        email: "",
        password: "",
        role: "",
        profile: "",
      };
    
      const [name, setName] = useState("");
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [role, setRole] = useState("");
      const [profile, setProfile] = useState("");
      const [validationErrors, setValidationErrors] = useState(noValidationErrors);
      const [error, setError] = useState<string | null>(null);
    
      const userData: IUser = { name, email, password, role, profile } as IUser;
    
      const validateForm = () => {
        const parsed = UserSchema.safeParse(userData);
        if (parsed.success) {
          setValidationErrors(noValidationErrors);
          return true;
        } else {
          const newErrors = noValidationErrors;
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
            const response = await addUser(userData);
            if (response) {
              toast.success("נרשמת בהצלחה!");
              setTimeout(() => {
                router.push("/pages/home");
              }, 2000);
            } else {
              setError("היתה בעיה בהרשמה. נסה שוב.");
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
            <h2 className="text-3xl font-bold text-center mb-8">הרשמה</h2>
            {error && <p className="text-red-500 text-center mb-6">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-md font-medium text-gray-700 mb-2"
                >
                  Name
                </label>
                <input
                  type="string"
                  id="name"
                  className={`w-full mt-1 p-3 border rounded-lg text-md ${
                    validationErrors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.name}
                  </p>
                )}
              </div>
    
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-md font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={`w-full mt-1 p-3 border rounded-lg text-md ${
                    validationErrors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.email}
                  </p>
                )}
              </div>
    
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-md font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className={`w-full mt-1 p-3 border rounded-lg text-md ${
                    validationErrors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {validationErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.password}
                  </p>
                )}
              </div>
    
              <div className="mb-6">
                <label
                  htmlFor="role"
                  className="block text-md font-medium text-gray-700 mb-2"
                >
                  Role
                </label>
                <select
                  id="role"
                  className={`w-full mt-1 p-3 border rounded-lg text-md ${
                    validationErrors.role
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  <option value="Candidate">Candidate</option>
                  <option value="Employee">Employee</option>
                </select>
                {validationErrors.role && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.role}
                  </p>
                )}
              </div>
    
              <div className="mb-6">
                <label
                  htmlFor="profile"
                  className="block text-md font-medium text-gray-700 mb-2"
                >
                  Profile
                </label>
                <input
                  type="text"
                  id="profile"
                  className={`w-full mt-1 p-3 border rounded-lg text-md ${
                    validationErrors.profile
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                  required
                />
                {validationErrors.profile && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.profile}
                  </p>
                )}
              </div>
    
              <button
                type="submit"
                className="w-full py-3 mt-8 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                הוסף
              </button>
            </form>
          </div>
        </div>
    );
};
    
export default page
