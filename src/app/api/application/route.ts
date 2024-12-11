import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import Application from "@/app/lib/models/Application"; 
import Job from "@/app/lib/models/Job"; 
import jwt from "jsonwebtoken";

// GET all applications for the specific user (candidate or employee)
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
    const decoded = jwt.verify(token, secret) as { role: string, email: string }; 
    const email = decoded.email; // Get the email from the decoded token
    const role = decoded.role;

    if (!email) {
      return NextResponse.json({ message: "Email not found in token" }, { status: 400 });
    }

    await connect(); // Connect to MongoDB

    let applications = null;

    if (role === "candidate") {
      // Fetch applications for the candidate (filter by email)
      applications = await Application.find({ "userEmail": email })
        .populate("jobId", "title company");
    } else if (role === "employee") {
      // Fetch applications for the employee (filter by job created by employee)
      applications = await Application.find()
        .populate({
          path: "jobId",
          select: "title company createdBy",
          match: { createdBy: email } 
        });

      // Filter out any applications where the job is not created by the employee
      applications = applications.filter((application) => application.jobId !== null);
    }

    return NextResponse.json(applications, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching applications", error },
      { status: 500 }
    );
  }
}

// POST a new application
export async function POST(req: NextRequest) {
  try {
    const applicationData = await req.json();

    // Connect to MongoDB
    await connect();
    const newApplication = new Application(applicationData); // Create a new Application
    await newApplication.save();
    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating application", error },
      { status: 500 }
    );
  }
}
