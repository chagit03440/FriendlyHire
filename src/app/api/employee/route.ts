import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import Employee from "@/app/lib/models/Employee"; // Update to use the Employee model

// GET all employees
export async function GET() {
  try {
    await connect(); // Connect to MongoDB
    const employees = await Employee.find(); // Fetch all employees
    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching employees", error },
      { status: 500 }
    );
  }
}

// POST a new employee
export async function POST(req: NextRequest) {
  try {
    const employeeData = await req.json();

    // Connect to MongoDB
    await connect();
    const newEmployee = new Employee(employeeData); // Create a new Employee
    await newEmployee.save();
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating employee", error },
      { status: 500 }
    );
  }
}
