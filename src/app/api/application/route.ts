import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import Application from "@/app/lib/models/Application";
import jwt from "jsonwebtoken";

// GET applications with Cache-Control and logging
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

    const decoded = jwt.verify(token, secret) as { role: string; email: string };
    const email = decoded.email;
    const role = decoded.role;

    if (!email) {
      return NextResponse.json({ message: "Email not found in token" }, { status: 400 });
    }

    await connect();

    let applications;

    if (role === "candidate") {
      applications = await Application.find({ userEmail: email }).populate(
        "jobId",
        "title company"
      );
    } else if (role === "employee") {
      applications = await Application.find().populate({
        path: "jobId",
        select: "title company createdBy",
        match: { createdBy: email },
      });
      applications = applications.filter((application) => application.jobId !== null);
    } else if (role === "admin") {
      applications = await Application.find().populate("jobId", "title company createdBy");
    } else {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(applications, {
      status: 200,
      headers: {
        "Cache-Control": "no-store", // Prevent caching
      },
    });
  } catch (error) {
    console.error("Error fetching applications:", error); // Log error
    return NextResponse.json({ message: "Error fetching applications", error }, { status: 500 });
  }
}


// POST a new application (only candidates can apply)
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

    // Check if the user has the 'candidate' role
    if (role !== "candidate") {
      return NextResponse.json(
        { message: "Permission denied. Only candidates can post applications." },
        { status: 403 }
      );
    }

    // Parse the application data from the request body
    const applicationData = await req.json();

    // Connect to MongoDB
    await connect();

    // Create a new Application
    const newApplication = new Application(applicationData);
    await newApplication.save();

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating application", error },
      { status: 500 }
    );
  }
}
