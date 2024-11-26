import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import Employee from "@/app/lib/models/Employee"; // Update to use the Employee model

// GET a specific employee
export async function GET(
  req: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  const { employeeId } = params;

  try {
    await connect(); // Connect to MongoDB
    const employee = await Employee.findById(employeeId);
    if (!employee)
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
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
  const { name, position, email, salary, hireDate } = await req.json();

  console.log("Updating employee with ID:", employeeId);
  console.log("Updated Employee Data:", {
    name,
    position,
    email,
    salary,
    hireDate,
  });

  try {
    await connect(); // Connect to MongoDB
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      { name, position, email, salary, hireDate },
      { new: true } // Return the updated document
    );
    if (!updatedEmployee)
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
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
    const deletedEmployee = await Employee.findByIdAndDelete(employeeId);
    if (!deletedEmployee)
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
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
