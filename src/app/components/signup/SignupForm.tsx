"use client";
import { useState } from "react";
import { UserSchema } from "@/app/types/userZod";
import IUser from "@/app/types/user";

interface SignupFormProps {
  onSignupSuccess: (userData: IUser) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignupSuccess }) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userData: IUser = { name, email, password, role, profile } as IUser;

  const validateForm = () => {
    const parsed = UserSchema.safeParse(userData);
    if (parsed.success) {
      setValidationErrors(noValidationErrors);
      return true;
    } else {
      const newErrors = { ...noValidationErrors };
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
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 4000));
        onSignupSuccess(userData);
      } catch (err) {
        console.error("Error during signup:", err);
        setError("An error occurred. Please try again.");
      } finally {
        setIsSubmitting(false); 
      }
    } else {
      setError("Please correct the errors below");
    }
  };

  const inputClassName = (fieldError: string) => `
    w-full p-3 rounded-lg text-gray-800 bg-white
    border-2 transition-all duration-200
    ${fieldError
      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
      : "border-gray-200 focus:border-orange-400 focus:ring-orange-200"
    }
    focus:outline-none focus:ring-4
  `;

  const labelClassName = "block text-gray-800 font-semibold mb-2";

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className={labelClassName}>
            Name
          </label>
          <input
            type="text"
            id="name"
            className={inputClassName(validationErrors.name)}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {validationErrors.name && (
            <p className="mt-1 text-red-500 text-sm">{validationErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={labelClassName}>
            Email
          </label>
          <input
            type="email"
            id="email"
            className={inputClassName(validationErrors.email)}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {validationErrors.email && (
            <p className="mt-1 text-red-500 text-sm">
              {validationErrors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className={labelClassName}>
            Password
          </label>
          <input
            type="password"
            id="password"
            className={inputClassName(validationErrors.password)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {validationErrors.password && (
            <p className="mt-1 text-red-500 text-sm">
              {validationErrors.password}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="role" className={labelClassName}>
            Role
          </label>
          <select
            id="role"
            className={inputClassName(validationErrors.role)}
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
            <p className="mt-1 text-red-500 text-sm">{validationErrors.role}</p>
          )}
        </div>

        <div>
          <label htmlFor="profile" className={labelClassName}>
            Tell us about yourself
          </label>
          <textarea
            id="profile"
            rows={4}
            className={inputClassName(validationErrors.profile)}
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
            required
          />
          {validationErrors.profile && (
            <p className="mt-1 text-red-500 text-sm">
              {validationErrors.profile}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 text-white bg-orange-400 hover:bg-orange-600 
                   rounded-lg font-semibold shadow-md hover:shadow-lg
                   transform hover:-translate-y-0.5 transition-all duration-200
                   focus:outline-none focus:ring-4 focus:ring-orange-200"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
