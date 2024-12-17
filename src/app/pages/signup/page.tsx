"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import checkAccess from "@/app/utils/checkAccess";
import SignupForm from "@/app/components/signup/SignupForm";
import EmailVerification from "@/app/components/signup/EmailVerification";
import IUser from "@/app/types/user";
import { Toaster, toast } from "react-hot-toast";
import { sendVerificationCode } from "@/app/services/sendVerificationCode";


const Signup = () => {
  const router = useRouter();

  // State to manage user data and signup flow
  const [userData, setUserData] = useState<IUser | null>(null);
  const [isEmailVerificationStep, setIsEmailVerificationStep] = useState(false);

  // Check access on component mount
  useEffect(() => {
    const validateAccess = async () => {
      try {
        // Redirect to home if user already has access
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

  // Handler for successful initial signup
  const handleSignupSuccess = async (data: IUser) => {
    try {
      // Send verification code automatically when moving to email verification
      const response = await sendVerificationCode(data.email);

      if (response.success) {
        setUserData(data);
        setIsEmailVerificationStep(true);
      } else {
        toast.error(response.message || "שליחת קוד אימות נכשלה");
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      toast.error("אירעה שגיאה בשליחת קוד אימות");
    }
  };

  // Handler to go back to signup form
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
