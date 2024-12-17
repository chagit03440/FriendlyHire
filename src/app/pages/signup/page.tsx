"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import checkAccess from "@/app/utils/checkAccess";
import SignupForm from "@/app/components/signup/SignupForm";
import EmailVerification from "@/app/components/signup/EmailVerification";
import IUser from "@/app/types/user";

const Signup = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<IUser | null>(null);
  const [isEmailVerificationStep, setIsEmailVerificationStep] = useState(false);

  useEffect(() => {
    const validateAccess = async () => {
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

  const handleSignupSuccess = (data: IUser) => {
    setUserData(data);
    setIsEmailVerificationStep(true);
  };

  const handleBackToSignup = () => {
    setIsEmailVerificationStep(false);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-100 py-8">
      <Toaster />
      <div className="bg-white p-12 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-8">הרשמה</h2>

        {!isEmailVerificationStep ? (
          <SignupForm onSignupSuccess={handleSignupSuccess} />
        ) : (
          userData && (
            <EmailVerification
              userData={userData}
              onBack={handleBackToSignup}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Signup;
