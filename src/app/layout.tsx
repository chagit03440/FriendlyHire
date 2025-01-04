"use client";
import "./globals.css";
import NavBar from "./components/layout/nav/NavBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { UserProvider, useUser } from "./store/UserContext";
import Footer from "./components/layout/Footer";
import { useRouter } from "next/navigation";

import Script from "next/script";

const LayoutContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [queryClient] = useState(() => new QueryClient());
  const { setRole, setMail } = useUser();
  const router = useRouter();
  const hasMounted = useRef(false);



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
          src="https://cdn.enable.co.il/licenses/enable-L33736ao60vh5q9z-1124-66724/init.js"
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
