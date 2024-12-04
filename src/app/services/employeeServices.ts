import axios from "axios";
import IEmployee from "../types/employee";


export const getEmployee = async (email: string) => {
  try {
    const response = await axios.get(`/api/employee/${email}`);
    const data = response.data;
    console.log("Employee:", data);
    return data;
  } catch (error) {
    console.error("Error getting employee:", error);
    throw error;
  }
};
export const createEmployee = async (employee: IEmployee) => {
  try {
    const response = await axios.post("/api/signup", employee);
    const data = response.data;
    console.log("Employee successfully created:", data);

    if (data.message === "Employee created successfully") {
      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error("Error creating employee:", error);
    return {
      success: false,
      message: "Employee with this username or email already exists",
    };
  }
};
export const updateEmployee = async (
  id: string,
  employee: { company: string; position: string }
) => {
  try {
    const response = await axios.put(`/api/employee/${id}`, employee);
    const data = response.data;
    console.log("Employee updated:", data);
    return data;
  } catch (error) {
    console.error("Error updating employee:", error);
  }
};


