import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import Job from "@/app/lib/models/Job"; // Update to use the Job model

// GET a specific job
export async function GET(
  
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;

  try {
    await connect(); // Connect to MongoDB
    const job = await Job.findById(jobId);
    if (!job)
      return NextResponse.json(
        { message: "Job not found" },
        { status: 404 }
      );
    return NextResponse.json(job, { status: 200 });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { message: "Error fetching job", error },
      { status: 500 }
    );
  }
}

// PUT to update an existing job
export async function PUT(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;
  const { title, company, location, description, salary, postedDate } =
    await req.json();

  console.log("Updating job with ID:", jobId);
  console.log("Updated Job Data:", {
    title,
    company,
    location,
    description,
    salary,
    postedDate,
  });

  try {
    await connect(); // Connect to MongoDB
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { title, company, location, description, salary, postedDate },
      { new: true } // Return the updated document
    );
    if (!updatedJob)
      return NextResponse.json(
        { message: "Job not found" },
        { status: 404 }
      );
    return NextResponse.json(updatedJob, { status: 200 });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { message: "Error updating job", error },
      { status: 500 }
    );
  }
}

// DELETE a job
export async function DELETE(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;

  try {
    await connect(); // Connect to MongoDB
    const deletedJob = await Job.findByIdAndDelete(jobId);
    if (!deletedJob)
      return NextResponse.json(
        { message: "Job not found" },
        { status: 404 }
      );
    return NextResponse.json(
      { message: "Job deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { message: "Error deleting job", error },
      { status: 500 }
    );
  }
}
