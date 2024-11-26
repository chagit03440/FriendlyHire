import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import Job from "@/app/lib/models/Job"; // Update to use the Job model

// GET all jobs
export async function GET() {
  try {
    await connect(); // Connect to MongoDB
    const jobs = await Job.find(); // Fetch all jobs
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
  try {
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
