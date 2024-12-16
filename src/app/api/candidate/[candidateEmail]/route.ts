import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connect from "@/app/lib/db/mongodb";
import Candidate from "@/app/lib/models/Candidate"; // Update to use the Candidate model

// Secret key for JWT verification
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// GET a specific candidate
export async function GET(
  req: NextRequest,
  { params }: { params: { candidateEmail: string } }
) {
  const {candidateEmail } = await params;

  try {
    await connect(); // Connect to MongoDB

    // Extract and verify token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token",error },
        { status: 401 }
      );
    }

    const { role, email } = decoded as { role: string; email: string };

    // Allow admin or the specific candidate
    if (role !== "admin" && email !==candidateEmail) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    const candidate = await Candidate.findOne({ email:candidateEmail });
    if (!candidate) {
      return NextResponse.json(
        { message: "Candidate not found" },
        { status: 404 }
      );
    }

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
  { params }: { params: {candidateEmail: string } }
) {
  const {candidateEmail } = params;
  const { name, email, password, profile, experience, skills, fileUrl } =
    await req.json();

  try {
    await connect(); // Connect to MongoDB

    // Extract and verify token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" ,error},
        { status: 401 }
      );
    }

    const { role, email: tokenEmail } = decoded as { role: string; email: string };

    // Allow admin or the specific candidate
    if (role !== "admin" && tokenEmail !==candidateEmail) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    const updatedCandidate = await Candidate.findOneAndUpdate(
      { email:candidateEmail },
      { name, email, password, role, profile, experience, skills, fileUrl },
      { new: true } // Return the updated document
    );

    if (!updatedCandidate) {
      return NextResponse.json(
        { message: "Candidate not found" },
        { status: 404 }
      );
    }

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
  { params }: { params: {candidateEmail: string } }
) {
  const {candidateEmail } = params;

  try {
    await connect(); // Connect to MongoDB

    // Extract and verify token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" ,error},
        { status: 401 }
      );
    }

    const { role } = decoded as { role: string };

    // Only allow admin to delete a candidate
    if (role !== "admin") {
      return NextResponse.json(
        { message: "Only admins can delete candidates" },
        { status: 403 }
      );
    }

    const deletedCandidate = await Candidate.findByIdAndDelete(candidateEmail);
    if (!deletedCandidate) {
      return NextResponse.json(
        { message: "Candidate not found" },
        { status: 404 }
      );
    }

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
