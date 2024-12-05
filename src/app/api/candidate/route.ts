import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import Candidate from "@/app/lib/models/Candidate"; // Update to use the Candidate model

// GET all candidates
export async function GET() {
  try {
    await connect(); // Connect to MongoDB
    const candidates = await Candidate.find(); 
    return NextResponse.json(candidates, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching candidates", error },
      { status: 500 }
    );
  }
}

// POST a new candidate
export async function POST(req: NextRequest) {
  try {
     // Connect to MongoDB
     await connect();
    const { name, email, password, role, profile, experience, skills, fileUrl } = await req.json();

   
    const newCandidate = await Candidate.create({
      name,
      email,
      password,
      role,
      profile,
      experience,
      skills,
      fileUrl,
    });
    return NextResponse.json(newCandidate, { status: 201 });
  } catch (error) {
    console.error("Error creating candidate:", error);
    return NextResponse.json(
      { message: "Error creating candidate", error },
      { status: 500 }
    );
  }
}
