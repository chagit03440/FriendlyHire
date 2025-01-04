import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import Application from "@/app/lib/models/Application"; // Update to use the Application model
import IApplication from "@/app/types/application";
import Job from "@/app/lib/models/Job";
import jwt from "jsonwebtoken";


// GET a specific application
export async function GET(
  req: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  const { applicationId } = params;

  try {
    await connect(); // Connect to MongoDB
    const applications = await Application.findById(applicationId);
    if (!applications)
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { message: "Error fetching application", error },
      { status: 500 }
    );
  }
}

// PUT to update an existing application
export async function PUT(
  req: NextRequest,
) {

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
    
    const application: IApplication = await req.json();

    await connect(); // Connect to MongoDB

    // Fetch the job related to the application
    const job = await Job.findById(application.jobId); // assuming the application has a jobId field
    if (!job)
      return NextResponse.json(
        { message: "Job not found" },
        { status: 404 }
      );

    // Check if the job is open
    if (job.status !== "Open"&& role!=="admin") {
      return NextResponse.json(
        { message: "Cannot apply, job is not open" },
        { status: 400 }
      );
    }

    // If the job is open, proceed to update the application
    const updatedApplication = await Application.findByIdAndUpdate(
      application._id,
      application,
      { new: true } // Return the updated document
    );
    if (!updatedApplication)
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );

    return NextResponse.json(updatedApplication, { status: 200 });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { message: "Error updating application", error },
      { status: 500 }
    );
  }
}

// DELETE an application
export async function DELETE(
  req: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  const { applicationId } = params;

  try {
    await connect(); // Connect to MongoDB
    const deletedApplication = await Application.findByIdAndDelete(
      applicationId
    );
    if (!deletedApplication)
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    return NextResponse.json(
      { message: "Application deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { message: "Error deleting application", error },
      { status: 500 }
    );
  }
}
