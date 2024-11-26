import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (email === "user@example.com" && password === "111") {
    // יצירת token דינמי עם jwt
    const token = jwt.sign(
      { email }, // payload - אתה יכול לשים כל מידע שצריך כאן
      process.env.JWT_SECRET!, // סוד ליצירת ה-token
      { expiresIn: "1m" } // הגדרת תוקף
    );
    // יצירת Cookie עם ה-token
    // שם העוגיה הוא token וערכה הוא ה-token שהפקנו.
    // העוגיה זמינה לכל הדפים באתר (path=/).
    // היא תישלח רק על חיבור מאובטח (HTTPS) (secure).
    // היא לא ניתנת לגישה ב-JavaScript בצד הלקוח (HttpOnly).
    // היא נשלחת רק אם הבקשה היא מאותו אתר (SameSite=Strict).
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `token=${token}; path=/; secure; HttpOnly; SameSite=Strict`
    );

    // החזרת תשובה עם ה-token בעוגיה
    return NextResponse.json(
      { message: "Login successful", token },
      { headers }
    );
  } else {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }
}
