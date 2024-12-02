import axios from "axios";

export async function fetchProtectedData() {
  try {
    const response = await axios.get("/api/auth", {
      withCredentials: true, 
    });
    const data = response.data;

    console.log("Protected data received:", data);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Error:", error.response.data.message);
    } else {
      console.log("Unexpected error:", error);
    }
    return null;
  }
}

export async function loginAxiosForGetToken(email: string, password: string) {
  try {
    const response = await axios.post("/api/login", {
      email,
      password,
    });

    if (response.data?.role) {
      console.log("Login successful:", response.data);
      return { success: true, role: response.data.role };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Login error:", error.response.data.message);
    } else {
      console.log("Unexpected error:", error);
    }
  }
    return { success: false, role: null };
  
}
