import mongoose from "mongoose";

const PasswordResetSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  resetCode: { type: String, required: true },
  expirationTime: { type: Date, required: true },
});

export default mongoose.models.PasswordReset ||
  mongoose.model("PasswordReset", PasswordResetSchema);
