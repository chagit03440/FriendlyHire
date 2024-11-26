import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import Candidate from "@/app/lib/models/Candidate"; // Update to use the Candidate model

// GET a specific candidate
export async function GET(
  req: NextRequest,
  { params }: { params: { candidateId: string } }
) {
  const { candidateId } = params;

  try {
    await connect(); // Connect to MongoDB
    const candidate = await Candidate.findById(candidateId);
    if (!candidate)
      return NextResponse.json(
        { message: "Candidate not found" },
        { status: 404 }
      );
    return NextResponse.json(candidate, { status: 200 });
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return NextResponse.json(
      { message: "Error fetching candidate", error },
      { status: 500 }
    );
  }
}

// PUT to update an existing candidate
export async function PUT(
  req: NextRequest,
  { params }: { params: { candidateId: string } }
) {
  const { candidateId } = params;
  const { name, email, phone, skills, experience, resumeLink } = await req.json();

  console.log("Updating candidate with ID:", candidateId);
  console.log("Updated Candidate Data:", {
    name,
    email,
    phone,
    skills,
    experience,
    resumeLink,
  });

  try {
    await connect(); // Connect to MongoDB
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { name, email, phone, skills, experience, resumeLink },
      { new: true } // Return the updated document
    );
    if (!updatedCandidate)
      return NextResponse.json(
        { message: "Candidate not found" },
        { status: 404 }
      );
    return NextResponse.json(updatedCandidate, { status: 200 });
  } catch (error) {
    console.error("Error updating candidate:", error);
    return NextResponse.json(
      { message: "Error updating candidate", error },
      { status: 500 }
    );
  }
}

// DELETE a candidate
export async function DELETE(
  req: NextRequest,
  { params }: { params: { candidateId: string } }
) {
  const { candidateId } = params;

  try {
    await connect(); // Connect to MongoDB
    const deletedCandidate = await Candidate.findByIdAndDelete(candidateId);
    if (!deletedCandidate)
      return NextResponse.json(
        { message: "Candidate not found" },
        { status: 404 }
      );
    return NextResponse.json(
      { message: "Candidate deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting candidate:", error);
    return NextResponse.json(
      { message: "Error deleting candidate", error },
      { status: 500 }
    );
  }
}
