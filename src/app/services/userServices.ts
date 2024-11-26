import axios from "axios";
import IUser from "../types/user";

export const createUser = async (user: IUser) => {
  try {
    const response = await axios.post("/api/signup", user);
    const data = response.data;
    console.log("User successfully created:", data);

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
