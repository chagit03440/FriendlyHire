import axios from "axios";

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
