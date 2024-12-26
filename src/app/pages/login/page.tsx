"use client";
import { loginAxiosForGetToken } from "@/app/services/loginServices";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import checkAccess from "@/app/utils/checkAccess";
import LoginForm from "@/app/components/login/LoginForm";
import PasswordResetModal from "@/app/components/login/PasswordResetModal";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);

  useEffect(() => {
    const validateAccess = async () => {
      console.log("logout")

      try {
        const userData = await checkAccess();
        if (userData.hasAccess) {
          router.push("/pages/home");
        }
      } catch (error) {
        console.error(error);
      }
    };

    validateAccess();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { success } = await loginAxiosForGetToken(email, password);
      if (success) {
        toast.success("התחברת בהצלחה!");
        setTimeout(() => {
          router.push("/pages/home");
        }, 2000);
      } else {
        setError("היה בעיה בהתחברות. נסה שוב.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-100">
      <Toaster />
      <LoginForm
        email={email}
        password={password}
        error={error}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        onForgotPassword={() => setIsPasswordResetOpen(true)}
      />
      <PasswordResetModal
        isOpen={isPasswordResetOpen}
        onClose={() => setIsPasswordResetOpen(false)}
      />
    </div>
  );
};

export default Login;
