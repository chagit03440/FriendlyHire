import axios from "axios";
import IUser from "../types/user";

interface CreateUserParams {
  userData: IUser;
  verificationCode: string;
}

export const getUsers=async()=>{
  try{
    const response = await axios.get('/api/user');
    const data = response.data;
    return data;
  }catch(error){
    console.error('Error get applications:', error);
  }
}

export const createUser = async (userDataAndCode:CreateUserParams) => {
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
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      message: "User creation failed",
    };
  }
};

export const deleteUser = async (userEmail: string) => {
  try {
    const response = await axios.delete(`/api/user/${userEmail}`);
    
    if (response.status === 200) {
      return {
        success: true,
        message: response.data.message,
      };
    } else {
      return {
        success: false,
        message: response.data.message,
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle errors with response status 400 or others
      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response.data.message,
        };
      } else {
        return {
          success: false,
          message: "An unexpected error occurred while deleting the user",
        };
      }
    }
    return {
      success: false,
      message: "An error occurred while deleting the user",
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

export const addUser = async (user: IUser) => {
  try {
    console.log(user);
    
    const response = await axios.post("/api/user", user);
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

// New function: Get user by ID
export const getUser = async (userEmail: string) => {
  try {
    const response = await axios.get(`/api/user/${userEmail}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error getting User:", error);
    throw error;
  }
};

export const updateUser = async (
  email: string,
  user: IUser
  ) => {
  try {
    const response = await axios.put(`/api/user/${email}`, user);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error updating employee:", error);
  }
};


