import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token"); // בגרסה זו יש גישה ישירה לעוגיות דרך req.cookies
  // אם יש token, מחזירים תשובה עם מידע מאובטח
  if (token) {
    return NextResponse.json({ message: "Protected data", token });
  } else {
    // אם אין token, מחזירים תשובה עם שגיאה
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
