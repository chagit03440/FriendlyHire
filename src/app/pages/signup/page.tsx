"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/app/services/userServices";
import IUser from "@/app/types/user";
import { UserSchema } from "@/app/types/userZod";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
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
  const router = useRouter();

  const userData: IUser = { name, email, password, role, profile } as IUser;

  const validateForm = () => {
    console.log("hi");
    const parsed = UserSchema.safeParse(userData);
    if (parsed.success) {
      setValidationErrors(noValidationErrors);
      console.log("true");

      return true;
    } else {
      const newErrors = noValidationErrors;
      parsed.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof newErrors;
        newErrors[field] = err.message;
        console.log(err.message);
      });
      setValidationErrors(newErrors);
      console.log("false");

      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (validateForm()) {
        const response = await createUser(userData);
        if (response) {
          toast.success("התחברת בהצלחה!");
          setTimeout(() => {
            router.push("/pages/home"); // Redirect after showing the toast
          }, 2000); // Wait for 2 seconds               
        } else {
          setError("היתה בעיה בהתחברות. נסה שוב.");
        }
      }
    } catch (error) {
      console.error(error);
      setError("אירעה שגיאה. אנא נסה שוב.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster />
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
              className={`w-full mt-1 p-2 border rounded-md ${
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
              className={`w-full mt-1 p-2 border rounded-md ${
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
              className={`w-full mt-1 p-2 border rounded-md ${
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

          <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              className={`w-full mt-1 p-2 border rounded-md ${
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
              className={`w-full mt-1 p-2 border border-gray-300 rounded-md${
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
