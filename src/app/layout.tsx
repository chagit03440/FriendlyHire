'use client';
import "./globals.css";
import NavBar from "./components/NavBar";
import { useRoleStore } from "./store/userStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  const updateRole = useRoleStore((state) => state.updateRole);

  updateRole("Login");

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <NavBar />
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
