"use client";
import { useState } from "react";
import { UserSchema } from "@/app/types/userZod";
import IUser from "@/app/types/user";

// Define the props interface for the SignupForm component
interface SignupFormProps {
  onSignupSuccess: (userData: IUser) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignupSuccess }) => {
  // Initial state for validation errors - empty strings for all fields
  const noValidationErrors = {
    name: "",
    email: "",
    password: "",
    role: "",
    profile: "",
  };

  // State management for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [profile, setProfile] = useState("");

  // State for tracking validation errors and general error messages
  const [validationErrors, setValidationErrors] = useState(noValidationErrors);
  const [error, setError] = useState<string | null>(null);

  // Compile user data from current state
  const userData: IUser = { name, email, password, role, profile } as IUser;

  // Validate form using Zod schema
  const validateForm = () => {
    // Use Zod's safeParse to validate the entire user object
    const parsed = UserSchema.safeParse(userData);

    if (parsed.success) {
      // If validation passes, clear any previous errors
      setValidationErrors(noValidationErrors);
      return true;
    } else {
      // If validation fails, map errors to specific fields
      const newErrors = { ...noValidationErrors };
      parsed.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof newErrors;
        newErrors[field] = err.message;
      });

      // Update validation errors state
      setValidationErrors(newErrors);
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior
    e.preventDefault();

    // Validate form before proceeding
    if (validateForm()) {
      // Call the success handler passed from parent component
      onSignupSuccess(userData);
    }
    else {
      setError("error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500 text-center mb-6">{error}</p>}

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
          <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
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
          <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
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
          <p className="text-red-500 text-sm mt-1">{validationErrors.role}</p>
        )}
      </div>

      <div className="mb-6">
        <label
          htmlFor="profile"
          className="block text-md font-medium text-gray-700 mb-2"
        >
          Tell us a little about yourself
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
        המשך
      </button>
    </form>
  );
};

export default SignupForm;
