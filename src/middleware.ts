import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
    const { pathname } = await req.nextUrl;
    
    const token = req.cookies.get("token")?.value;

    if (!token) {
        // If no token, redirect or block access to APIs
        return NextResponse.redirect(new URL("/", req.url));
    }

    try {
        // Verify JWT
        const { payload } = await jwtVerify(token, secretKey);

        // Check roles
        const userRole = payload.role;

        if (pathname.startsWith("/admin") && userRole !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (pathname.startsWith("/candidate") && userRole === "employee") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (pathname.startsWith("/employee") && userRole === "candidate") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (pathname.includes("/candidate") && userRole === "employee") {
            return NextResponse.redirect(new URL("/", req.url));
        }
        
        if (pathname.includes("/employee") && userRole === "candidate") {
            return NextResponse.redirect(new URL("/", req.url));
        }
        
    } catch (error) {
        console.error("Invalid token:", error);
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

// Define paths to apply the middleware
export const config = {
  matcher: [
    "/pages/home/candidate/:path*", // Candidate pages
    "/pages/home/employee/:path*", // Employee pages
    "/pages/home/admin/:path*", 
    "/pages/home/profile/:path*", 
    "/api/candidate/:path*",  // Candidate-related APIs
    "/api/employee/:path*",   // Employee-related APIs
    "/api/application:path*",  
    "/api/job:path*", 
    "/api/role:path*",  
  ],
};
