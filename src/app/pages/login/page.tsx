"use client";
import { loginAxiosForGetToken } from "@/app/services/loginServices";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import checkAccess from "@/app/store/checkAccess";

const Login = () => {

  const router = useRouter();

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const userData = await checkAccess();
        if (userData.hasAccess) {
          router.push("/pages/home");
      }} catch (error) {
        console.log(error);
      }
    };

    validateAccess();
  }, [router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const  {success }  = await loginAxiosForGetToken(email, password);
      console.log("success", success);
      if (success) {
        toast.success("התחברת בהצלחה!");
        setTimeout(() => {
          router.push("/pages/home"); // Redirect after showing the toast
        }, 2000); // Wait for 2 seconds
      } else {
        console.log("היה בעיה בהתחברות. נסה שוב.");
        setError("היה בעיה בהתחברות. נסה שוב.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-100">
      <Toaster />
      <div className="bg-white p-12 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-6">התחברות</h2>
        {error && <p className="text-red-500 text-center mb-6">{error}</p>}
        <form onSubmit={handleSubmit}>
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-6 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            התחבר
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
