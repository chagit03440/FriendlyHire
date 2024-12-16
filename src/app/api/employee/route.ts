import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connect from "@/app/lib/db/mongodb";
import Employee from "@/app/lib/models/Employee";

// Secret key for JWT verification
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// GET all employees or specific employee based on role
export async function GET(req: NextRequest) {
  try {
    await connect(); // Connect to MongoDB

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  
   
    // Verify and decode token
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
      // Admin can get all employees
      const employees = await Employee.find();
      return NextResponse.json(employees, { status: 200 });
    } else if (role === "employee") {
      // Employee can get only their data
      const employee = await Employee.findById(id);
      if (!employee) {
        return NextResponse.json(
          { message: "Employee not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(employee, { status: 200 });
    } else {
      // Candidates and others are not allowed
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }
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
    const { name, email, password, role, profile, company, position } =
      await req.json();

    const newEmployee = await Employee.create({
      name,
      email,
      password,
      role,
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