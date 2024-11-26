import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import Application from "@/app/lib/models/Application"; // Update to use the Application model

// GET all applications
export async function GET() {
  try {
    await connect(); // Connect to MongoDB
    const applications = await Application.find(); // Fetch all applications
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
