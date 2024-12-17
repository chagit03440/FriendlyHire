import axios from "axios";
import IUser from "../types/user";

interface CreateUserParams {
  userData: IUser;
  verificationCode: string;
}

export const createUser = async (userDataAndCode: CreateUserParams) => {
  try {
    const response = await axios.post("/api/signup", {
      ...userDataAndCode.userData,
      verificationCode: userDataAndCode.verificationCode,
    });
    const data = response.data;

    if (data.message === "Sign-up successful") {
      return {
        success: true,
        message: data.message,
        user: data.user,
      };
    } else {
      return {
        success: false,
        message: data.message,
      };
    }
  } catch (error: any) {
    console.error("Error creating user:", error);
    return {
      success: false,
      message: error.response?.data?.message || "User creation failed",
    };
  }
};

export async function getRoleFromToken() {
  try {
    const response = await axios.get("/api/role");
    return { success: true, role: response.data.role };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error:", error.response.data.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return { success: false, role: null };
  }
}
