import axios from "axios";

interface ApiResponse {
  success: boolean;
  message?: string;
}

export const sendVerificationCode = async (
  email: string
): Promise<ApiResponse> => {

  console.log(`in sendVerificationCode service`);
  try {
    const response = await axios.post(`/api/auth/send-verification-code`, {
      email,
    });
    console.log(`out of the api`);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    console.error("Send verification code error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "שליחת קוד אימות נכשל",
    };
  }
};
