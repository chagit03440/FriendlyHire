"use client";
import React from "react";

interface LoginFormProps {
  email: string;
  password: string;
  error: string | null;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
}) => {
  return (
    <div className="bg-white p-12 rounded-xl shadow-2xl w-full max-w-lg">
      <h2 className="text-3xl font-bold text-center mb-6">התחברות</h2>
      {error && <p className="text-red-500 text-center mb-6">{error}</p>}
      <form onSubmit={onSubmit}>
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
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg text-md"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
          />
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
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg text-md"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-6 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          התחבר
        </button>

        <button
          type="button"
          onClick={onForgotPassword}
          className="w-full py-2 mt-4 text-md text-blue-600 hover:text-blue-800 transition-colors duration-300"
        >
          שכחתי סיסמה
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
