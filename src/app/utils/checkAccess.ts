"use client";
import { fetchProtectedData } from "@/app/services/loginServices";

const checkAccess = async () => {
  try {
    const validation = await fetchProtectedData();

    if (validation.message === "Protected data") {
      return { hasAccess: true, ...validation };
    }
    if (validation.message === "Unauthorized") {
      return { hasAccess: false };
    } else {
      throw new Error("Unauthorized");
    }
  } catch (error) {
    console.error("Access denied:", error);
    return { hasAccess: false };
  }
};

export default checkAccess;
