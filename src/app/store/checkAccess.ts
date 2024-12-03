import { fetchProtectedData } from "@/app/services/loginServices";

const checkAccess = async () => {
  try {
    const validation = await fetchProtectedData();
    console.log("validation data", validation);

    if (validation.message === "Protected data") {
      console.log("יש לך גישה למידע המוגן:", validation);
        return { hasAccess: true, ...validation};
    } else {
      throw new Error("Unauthorized");
    }
  } catch (error) {
    console.error("Access denied:", error);
    return { hasAccess: false};
  }
};

export default checkAccess;
