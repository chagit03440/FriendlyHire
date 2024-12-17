import mongoose from "mongoose";

const emailVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  verificationCode: {
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
emailVerificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

const EmailVerification =
  mongoose.models.EmailVerification ||
  mongoose.model("EmailVerification", emailVerificationSchema);

export default EmailVerification;
