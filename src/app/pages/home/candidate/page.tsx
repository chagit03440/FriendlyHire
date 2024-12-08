"use client";
import CandidateDashboard from "@/app/components/CandidateDashboard";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import checkAccess from "@/app/utils/checkAccess";

const Page = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const userData = await checkAccess();
        if (!userData.hasAccess) {
          router.push("/pages/login");
        } else if (userData.role.toLowerCase() !== "candidate") {
          router.push("/pages/home");
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log(error);
        router.push("/pages/login");
      }
    };

    validateAccess();
  }, [router]);

  if (!isAuthenticated) {
    return <p>...טוען</p>;
  }
  return (
    <div>
      <CandidateDashboard />
    </div>
  );
};

export default Page;
