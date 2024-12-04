import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import Employee from "@/app/lib/models/Employee"; // Update to use the Employee model

// GET all employees
export async function GET() {
  try {
    await connect(); // Connect to MongoDB
    const employees = await Employee.find(); 
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
    // Connect to MongoDB
    await connect();
    const { name, email, password, profile, company, position } =
      await req.json();

    const newEmployee = await Employee.create({
      name,
      email,
      password,
      profile,
      company,
      position,
    });
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { message: "Error creating employee", error },
      { status: 500 }
    );
  }
}
