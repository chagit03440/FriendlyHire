"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { sendVerificationCode } from "@/app/services/sendVerificationCode";
import { createUser } from "@/app/services/userServices";
import IUser from "@/app/types/user";
import { useRouter } from "next/navigation";

interface EmailVerificationProps {
  userData: IUser;
  onBack: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  userData,
  onBack,
}) => {
  // State for verification code and error handling
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Resend verification code handler
  const handleSendVerificationCode = async () => {
    const response = await sendVerificationCode(userData.email);
    if (response.success) {
      toast.success(response.message || "Verification code sent successfully.");
    } else {
      toast.error(response.message || "Failed to send verification code.");
    }
  };

  // Handle email verification and user creation
  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Attempt to create user with verification code
      const response = await createUser({
        userData,
        verificationCode,
      });

      if (response.success) {
        // Success: show toast and redirect
        toast.success("Registration completed successfully!");
        setTimeout(() => {
          router.push("/pages/home");
        }, 2000);
      } else {
        // Handle creation failure
        setError(response.message || "Registration failed.");
        toast.error(response.message || "Registration failed.");
      }
    } catch (error) {
      // Handle unexpected errors
      console.error(error);
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Email Verification</h2>

      <p className="text-center mb-6">
        .{userData.email} A verification code has been sent to your email address
      </p>
      <p className="text-center mb-6">Please enter the code you received.</p>

      {error && <p className="text-red-500 text-center mb-6">{error}</p>}

      <form onSubmit={handleVerification}>
        <div className="mb-6">
          <label
            htmlFor="verificationCode"
            className="block text-md font-medium text-gray-700 mb-2"
          >
            Verification Code
          </label>
          <input
            type="text"
            id="verificationCode"
            className="w-full mt-1 p-3 border rounded-lg text-md border-gray-300 focus:ring-blue-500"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="w-1/2 mr-2 py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Verify
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-1/2 ml-2 py-3 text-lg bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-300"
          >
            Go Back
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleSendVerificationCode}
            className="text-blue-600 hover:underline"
          >
            Resend Verification Code
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailVerification;
