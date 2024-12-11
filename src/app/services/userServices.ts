import axios from "axios";
import IUser from "../types/user";

export const createUser = async (user: IUser) => {
  try {
    const response = await axios.post("/api/signup", user);
    const data = response.data;

    if (data.message === "User created successfully") {
      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      message: "User with this username or email already exists",
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
