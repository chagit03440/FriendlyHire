import { z } from "zod";

const JobSchema = z.object({
  _id: z.string(), // Unique job ID as a string
  title: z.string().min(2, "Title must be at least 2 characters"), // Validates title with a minimum length
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"), // Detailed description
  experience: z.number().int().nonnegative("Experience cannot be negative"), // Non-negative integer for required experience
  company: z.string().min(1, "Company name is required"), // Company name with minimum length
  requirements: z
    .array(z.string().min(1, "Each requirement must be at least 1 character"))
    .max(20, "Requirements can contain a maximum of 20 items"), // Array of skills with a limit
  location: z.string().min(1, "Location is required"), // Job location
  status: z.enum(["Open", "Closed"]), // Status limited to "Open" or "Closed"
  createdBy: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId"), // Validates a MongoDB ObjectId
});

export { JobSchema };
