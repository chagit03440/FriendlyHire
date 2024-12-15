import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connect from "@/app/lib/db/mongodb";
import Employee from "@/app/lib/models/Employee";

// Secret key for JWT verification
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// GET a specific employee
export async function GET(
  req: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  const { employeeId } = params;

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
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { role, id ,email} = decoded as { role: string; id: string , email: string };

    // Only allow admin or the specific employee
    if (role !== "admin" && email !== employeeId) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    const employee = await Employee.findOne({ email: employeeId });
    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json(
      { message: "Error fetching employee", error },
      { status: 500 }
    );
  }
}

// PUT to update an existing employee
export async function PUT(
  req: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  const { employeeId } = params;
  const { name, email, password, role, profile, company, position } = await req.json();

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
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { role, id ,email} = decoded as { role: string; id: string , email: string };

    // Only allow admin or the specific employee
    if (role !== "admin" && email !== employeeId) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    const updatedEmployee = await Employee.findOneAndUpdate(
      { email: employeeId },
      { name, email, password, role, profile, company, position },
      { new: true } // Return the updated document
    );
    if (!updatedEmployee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEmployee, { status: 200 });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { message: "Error updating employee", error },
      { status: 500 }
    );
  }
}

// DELETE an employee
export async function DELETE(
  req: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  const { employeeId } = params;

  try {
    await connect(); // Connect to MongoDB

    // Extract and verify token
    const token = req.headers.get("Authorization")?.split(" ")[1];
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
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { role, id ,email} = decoded as { role: string; id: string , email: string };

    // Only allow admin to delete an employee
    if (role !== "admin") {
      return NextResponse.json(
        { message: "Only admins can delete employees" },
        { status: 403 }
      );
    }

    const deletedEmployee = await Employee.findByIdAndDelete(employeeId);
    if (!deletedEmployee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Employee deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { message: "Error deleting employee", error },
      { status: 500 }
    );
  }
}
