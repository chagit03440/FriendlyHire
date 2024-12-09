import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import Application from "@/app/lib/models/Application"; // Update to use the Application model
import IApplication from "@/app/types/application";

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
  { params }: { params: { applicationId: string } }
) {
  const { applicationId } = params;
  const application :IApplication= await req.json();

  try {
    await connect(); // Connect to MongoDB
    const updatedApplication = await Application.findByIdAndUpdate(
      application._id ,application,
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
