"use client";
import React from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const inputClassName = `
    w-full p-3 rounded-lg text-gray-800 bg-white
    border-2 border-gray-200 transition-all duration-200
    focus:border-orange-400 focus:ring-orange-200
    focus:outline-none focus:ring-4
  `;

  const labelClassName = "block text-gray-800 font-semibold mb-2";

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <form onSubmit={onSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className={labelClassName}>
            Email
          </label>
          <input
            type="email"
            id="email"
            className={inputClassName}
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClassName}>
            Password
          </label>
          <input
            type="password"
            id="password"
            className={inputClassName}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 text-white bg-orange-400 hover:bg-orange-600 
                   rounded-lg font-semibold shadow-md hover:shadow-lg
                   transform hover:-translate-y-0.5 transition-all duration-200
                   focus:outline-none focus:ring-4 focus:ring-orange-200"
        >
          Log in
        </button>

        <button
          type="button"
          onClick={onForgotPassword}
          className="w-full py-2 text-gray-800 hover:text-orange-400 
                   font-medium transition-colors duration-200
                   focus:outline-none focus:ring-4 focus:ring-orange-200 rounded-lg"
        >
          Forgot Password?
        </button>
        <button
          type="button"
          className="w-full py-2 text-gray-800 hover:text-orange-400 
               font-medium transition-colors duration-200
               focus:outline-none focus:ring-4 focus:ring-orange-200 rounded-lg"
          onClick={() => router.push("/pages/signup")}
        >
          Don&apos;t have an account yet?
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
