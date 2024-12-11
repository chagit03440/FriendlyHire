import axios from "axios";
import ICandidate from "../types/candidate";
import IUser from "../types/user";
import IEmployee from "../types/employee";


export const getCandidate = async (email: string | null) => {
  try {
    const response = await axios.get(`/api/candidate/${email}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error getting Candidate:", error);
    throw error;
  }
};

export const createCandidate = async (candidate: ICandidate) => {
  try {
    const response = await axios.post("/api/signup", candidate);
    const data = response.data;

    if (data.message === "Candidate created successfully") {
      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error("Error creating candidate:", error);
    return {
      success: false,
      message: "Candidate with this username or email already exists",
    };
  }
};
export const updateCandidate = async (
  email: string,
  candidate: IUser & ICandidate | IUser & IEmployee
) => {
  try {
    const response = await axios.put(`/api/candidate/${email}`, candidate);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error updating candidate:", error);
  }
};
