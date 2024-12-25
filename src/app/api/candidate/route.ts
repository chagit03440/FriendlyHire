import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connect from "@/app/lib/db/mongodb";
import Candidate from "@/app/lib/models/Candidate";

// Secret key for JWT verification
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// GET all candidates or a specific candidate based on role
export async function GET(req: NextRequest) {
  try {
    await connect(); // Connect to MongoDB

    // Extract the token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify and decode the token
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token", error },
        { status: 401 }
      );
    }

    const { role, id } = decoded as { role: string; id: string };

    // Role-based access control
    if (role === "admin") {
      // Admin can get all candidates
      const candidates = await Candidate.find();
      return NextResponse.json(candidates, {
        status: 200,
        headers: {
          "Cache-Control": "no-store", // Prevent caching
        },
      });

    } else if (role === "candidate") {
      // Candidate can get only their data
      const candidate = await Candidate.findById(id);
      if (!candidate) {
        return NextResponse.json(
          { message: "Candidate not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(candidate, { status: 200 });
    } else {
      // Other roles are not allowed
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Error fetching candidates:", error);
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

    // Extract the candidate data from the request body
    const { name, email, password, role, profile, experience, skills, fileUrl } =
      await req.json();

    // Create a new candidate
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
