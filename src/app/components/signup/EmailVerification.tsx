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
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSendVerificationCode = async () => {
    const response = await sendVerificationCode(userData.email);
    if (response.success) {
      toast.success(response.message || "קוד אימות נשלח בהצלחה");
    } else {
      toast.error(response.message || "שליחת קוד אימות נכשלה");
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await createUser({
        userData,
        verificationCode,
      });

      if (response.success) {
        toast.success("נרשמת בהצלחה!");
        setTimeout(() => {
          router.push("/pages/home");
        }, 2000);
      } else {
        setError(response.message || "ההרשמה נכשלה");
        toast.error(response.message || "ההרשמה נכשלה");
      }
    } catch (error) {
      console.error(error);
      setError("אירעה שגיאה. אנא נסה שוב.");
      toast.error("אירעה שגיאה. אנא נסה שוב.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">אימות דוא״ל</h2>

      <p className="text-center mb-6">
        קוד אימות נשלח לכתובת הדוא״ל {userData.email}. אנא הזן את הקוד שקיבלת.
      </p>

      {error && <p className="text-red-500 text-center mb-6">{error}</p>}

      <form onSubmit={handleVerification}>
        <div className="mb-6">
          <label
            htmlFor="verificationCode"
            className="block text-md font-medium text-gray-700 mb-2"
          >
            קוד אימות
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
            אימות
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-1/2 ml-2 py-3 text-lg bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-300"
          >
            חזור
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleSendVerificationCode}
            className="text-blue-600 hover:underline"
          >
            שלח קוד אימות מחדש
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailVerification;
