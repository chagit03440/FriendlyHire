"use client";
import "./globals.css";
import NavBar from "./components/NavBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { UserProvider, useUser } from "./store/UserContext";
import Footer from "./components/Footer";
import { useRouter } from "next/navigation";
import checkAccess from "./utils/checkAccess";

const LayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  //const [setIsAuthenticated] = useState(false);
  const {setRole, setMail } = useUser();
  const router = useRouter();

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const accessData = await checkAccess();

        if (!accessData.hasAccess) {
          router.push("/pages/login");
        } else {
          //setIsAuthenticated(true);
          setRole(accessData.role.toLowerCase());
          setMail(accessData.email);
        }
      } catch (error) {
        console.error("Validation error:", error);
        router.push("/pages/login");
      }
    };

    validateAccess();
  }, [router, setRole, setMail]);

  return (
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
