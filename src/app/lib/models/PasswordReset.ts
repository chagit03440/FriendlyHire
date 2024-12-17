import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  resetCode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 900, // 15 minutes in seconds (15 * 60)
  },
});

// Create a TTL index on the createdAt field
passwordResetSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

const PasswordReset =
  mongoose.models.PasswordReset ||
  mongoose.model("PasswordReset", passwordResetSchema);

export default PasswordReset;
