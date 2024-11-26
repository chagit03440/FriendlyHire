import axios from "axios";

export const createUser = async (user: {
  name: string;
  email: string;
  password: string;
  role: "candidate" | "employee";
  profile: string ;
}) => {
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
