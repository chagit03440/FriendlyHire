'use client'
import "./globals.css";
import NavBar from "./components/NavBar";
import { useRoleStore } from "./store/userStore";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const updateRole= useRoleStore ((state) => state.updateRole);
  updateRole("Login");
  return (
    <html lang="en">
      <body>
        <NavBar/>
        {children}
      </body>
    </html>
  );
}
