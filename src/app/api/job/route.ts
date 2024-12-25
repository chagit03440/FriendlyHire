import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import Job from "@/app/lib/models/Job"; // Job model
import jwt from "jsonwebtoken";

// GET all jobs
export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT secret is not defined in environment variables.");
    }

    // Verify and decode the token to extract the email and role
    const decoded = jwt.verify(token, secret) as { role: string; email: string };
    const role = decoded.role;
    const email = decoded.email;

    if (!email) {
      return NextResponse.json({ message: "Email not found in token" }, { status: 400 });
    }

    await connect(); // Connect to MongoDB

    let jobs;

    if (role === "candidate") {
      // Fetch all open jobs and exclude "status" and "createdBy" fields
      jobs = await Job.find({ status: "Open" }).select("-status");
    } else if (role === "employee") {
      // Fetch jobs created by the employee
      jobs = await Job.find({ createdBy: email });
    } else if (role === "admin") {
      // Admins can view all jobs
      jobs = await Job.find(); // Admin gets all jobs with full details
    } else {
      return NextResponse.json({ message: "Invalid role" }, { status: 403 });
    }

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching jobs", error },
      { status: 500 }
    );
  }
}

// POST a new job
export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT secret is not defined in environment variables.");
    }

    // Verify and decode the token to extract the role
    const decoded = jwt.verify(token, secret) as { role: string; email: string };
    const role = decoded.role;

    // Only allow employees to create jobs
    if (role !== "employee" && role !== "admin" ) {
      return NextResponse.json(
        { message: "Permission denied. Only employees and admin can create jobs." },
        { status: 403 }
      );
    }

    const jobData = await req.json();

    // Connect to MongoDB
    await connect();
    const newJob = new Job(jobData); // Create a new Job
    await newJob.save();

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating job", error },
      { status: 500 }
    );
  }
}
