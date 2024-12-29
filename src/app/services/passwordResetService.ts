import axios from "axios";

interface ApiResponse {
  success: boolean;
  message?: string;
}

export const sendResetPasswordCode = async (
  email: string
): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`/api/login/send-reset-code`, {
      email,
    });
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error("Send reset code error:", error);
    return {
      success: false,
      message: "Failed to send the reset code.",
    };
  }
};

export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string
): Promise<ApiResponse> => {
  if (newPassword.length < 6) {
    return {
      success: false,
      message: "The password must be at least 6 characters long.",
    };
  }
  try {
    const response = await axios.post(`/api/login/reset-password`, {
      email,
      code,
      newPassword,
    });
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: "Password reset failed.",
    };
  }
};
