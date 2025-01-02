import axios from "axios";

interface ApiResponse {
  success: boolean;
  message?: string;
}

export const sendVerificationCode = async (
  email: string
): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`/api/signup/send-verification-code`, {
      email,
    });
     // Handling the response success/failure
     if (response.status === 400 && response.data.message === "Email already registered") {
      return {
        success: false,
        message: "Email already registered", // Customize this message
      };
    }
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error("Send verification code error:", error);
    return {
      success: false,
      message: "Failed to send verification code.",
    };
  }
};
