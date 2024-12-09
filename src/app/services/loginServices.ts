import axios from "axios";

export async function fetchProtectedData() {
  try {
    const response = await axios.get("/api/auth", {
      withCredentials: true, 
    });
    const data = response.data;

    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error:", error.response.data.message);
    } else {
      console.error("Unexpected error:", error);
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
      return { success: true, role: response.data.role };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Login error:", error.response.data.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
    return { success: false, role: null };
  
}
