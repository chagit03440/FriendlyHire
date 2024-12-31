"use client";
import React, { useState } from "react";
import {
  sendResetPasswordCode,
  resetPassword,
} from "@/app/services/passwordResetService";
import toast from "react-hot-toast";

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [stage, setStage] = useState<"email" | "code" | "password">("email");

  const handleSendResetCode = async () => {
    const response = await sendResetPasswordCode(email);
    if (response.success) {
      toast.success(response.message || "Reset code sent successfully.");
      setStage("code");
    } else {
      toast.error(response.message || "Failed to send reset code.");
    }
  };

  const handleResetPassword = async () => {
    const response = await resetPassword(email, resetCode, newPassword);
    if (response.success) {
      toast.success(response.message || "Password reset successfully.");
      onClose();
    } else {
      toast.error(response.message || "Password reset failed.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        {stage === "email" && (
          <div>
            <label
              htmlFor="reset-email"
              className="text-2xl font-bold text-center mb-6 text-gray-800 flex justify-center items-center"
            >
              Enter your email address.
            </label>
            <input
              type="email"
              id="reset-email"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg text-md text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="flex justify-between mt-6">
              <button
                onClick={handleSendResetCode}
                className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
              >
                Send Reset Code
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 ml-4 text-gray-800 hover:text-gray-600 transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {stage === "code" && (
          <div>
            <label
              htmlFor="reset-code"
              className="text-2xl font-bold text-center mb-6 text-gray-800 flex justify-center items-center"
            >
              Enter The Reset Code:
            </label>
            <input
              type="text"
              id="reset-code"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg text-md text-gray-800"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              required
            />
            <button
              onClick={() => setStage("password")}
              className="w-full py-3 mt-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
            >
              Continue
            </button>
          </div>
        )}

        {stage === "password" && (
          <div>
            <label
              htmlFor="new-password"
              className="text-2xl font-bold text-center mb-6 text-gray-800 flex justify-center items-center"
            >
              Enter The New Password:
            </label>
            <input
              type="password"
              id="new-password"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg text-md text-gray-800"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <div className="flex justify-between mt-6">
              <button
                onClick={handleResetPassword}
                className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
              >
                Reset Password
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 ml-4 text-gray-800 hover:text-gray-600 transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordResetModal;
