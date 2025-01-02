"use client";
import "./globals.css";
import NavBar from "./components/layout/nav/NavBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { UserProvider, useUser } from "./store/UserContext";
import Footer from "./components/layout/Footer";
import { useRouter } from "next/navigation";
import checkAccess from "./utils/checkAccess";

import Script from "next/script";

const LayoutContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [queryClient] = useState(() => new QueryClient());
  const { setRole, setMail } = useUser();
  const router = useRouter();

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const accessData = await checkAccess();

        if (!accessData.hasAccess) {
          // Reset user state and query cache on logout
          setRole(null);
          setMail(null);
          queryClient.clear(); // Clear all cached data
          router.push("/pages/login");
        } else {
          setRole(accessData.role.toLowerCase());
          setMail(accessData.email);
        }
      } catch (error) {
        console.error("Validation error:", error);
        setRole(null);
        setMail(null);
        queryClient.clear(); // Clear all cached data
        router.push("/pages/login");
      }
    };

    validateAccess();
  }, [router, setRole, setMail, queryClient]);

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
