import IUser from "@/app/types/user";
import mongoose, { Schema, Model } from "mongoose";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    profile: { type: String },
  },
  { discriminatorKey: "role", timestamps: true }
);

const User: Model<IUser> = 
mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
