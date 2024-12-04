"use client";
import "./globals.css";
import NavBar from "./components/NavBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { UserProvider } from "./store/UserContext";
import Footer from "./components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <UserProvider>
      <html lang="en">
        <body>
          <QueryClientProvider client={queryClient}>
            <div className="page-container">
              <NavBar />
              <main className="content-wrapper">{children}</main>
              <Footer />
            </div>
          </QueryClientProvider>
        </body>
      </html>
    </UserProvider>
  );
}
