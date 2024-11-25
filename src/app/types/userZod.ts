import { z } from "zod";

const UserSchema = z.object({
    name: z.string().min(1, "Name is required"), 
    email: z.string().email("Invalid email address"), 
    password: z.string().min(6, "Password must be at least 6 characters"), 
    role: z.enum(["candidate", "employee"]), 
    profile: z.string().min(1, "Profile is required"), 
  });
  
  export { UserSchema };