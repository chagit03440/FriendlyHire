"use client";
import "./globals.css";
import NavBar from "./components/layout/nav/NavBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { UserProvider } from "./store/UserContext";
import Footer from "./components/layout/Footer";

import Script from "next/script";

const LayoutContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <html lang="en">
      <head>
        <title>FriendlyHire</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <div className="page-container">
            <NavBar />
            <main className="content-wrapper">{children}</main>
            <Footer />
          </div>
        </QueryClientProvider>
        <Script
          src="https://cdn.enable.co.il/licenses/enable-L33736ao60vh5q9z-1124-67238/init.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <LayoutContent>{children}</LayoutContent>
    </UserProvider>
  );
}
