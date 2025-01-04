import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connect from "@/app/lib/db/mongodb";
import User from "@/app/lib/models/User";
import Application from "@/app/lib/models/Application";
import Job from "@/app/lib/models/Job";

// Secret key for JWT verification
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// GET a user by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { userEmail: string } }
) {
  const { userEmail } = params;
  try {
    await connect(); // Connect to MongoDB

    // Get the token from cookies
    const token = await req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error retrieving user:", error);
    return NextResponse.json(
      { message: "Error retrieving user", error },
      { status: 500 }
    );
  }
}

// PUT to update an existing user
export async function PUT(
  req: NextRequest,
  { params }: { params: { userEmail: string } }
) {
  const { userEmail } = params;
  const { name, password, profile } = await req.json();

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
        { message: "Invalid or expired token", error },
        { status: 401 }
      );
    }

    const { role, email } = decoded as { role: string; email: string };


    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { name, email, password, role, profile },
      { new: true } // Return the updated document
    );
    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating User:", error);
    return NextResponse.json(
      { message: "Error updating User", error },
      { status: 500 }
    );
  }
}

// DELETE a user (employee or candidate)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { userEmail: string } }
) {
  const { userEmail } = params;

  try {
    await connect(); // Connect to MongoDB

    // Get the token from cookies
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
        { message: "Invalid or expired token", error },
        { status: 401 }
      );
    }

    const { role } = decoded as { role: string };

    // Check if the user exists
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // If the role is 'admin', check if the user is an employee with applications
    if (role === "admin") {
      if (user.role === "employee") {
        // Check if this employee has any associated jobs
        const jobs = await Job.find({ createdBy: userEmail });

        // If the employee has any associated jobs, check if there are applications linked to them
        if (jobs.length > 0) {
          const applications = await Application.find().populate({
            path: "jobId",
            select: "title company createdBy",
            match: { createdBy: user.email },
          });
          if (applications.length > 0) {
            return NextResponse.json(
              { message: "Cannot delete employee with associated applications" },
              { status: 400 }
            );
          }
        }
      }
    }

    // If the user is a candidate and has applications, delete the applications too
    if (user.role === "candidate") {
      const userApplications = await Application.find({ userEmail: userEmail });
      if (userApplications.length > 0) {
        // Delete all applications of this candidate
        await Application.deleteMany({ userEmail: userEmail });
      }
    }

    // Finally, delete the user
    const deletedUser = await User.findOneAndDelete({ email: userEmail });
    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User and their applications deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Error deleting user", error },
      { status: 500 }
    );
  }
}
