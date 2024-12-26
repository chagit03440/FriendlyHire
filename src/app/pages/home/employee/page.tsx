"use client";
import EmployeeDashboard from "@/app/components/employee/EmployeeDashboard ";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import checkAccess from "@/app/utils/checkAccess";
import { JobActionsProvider } from "@/app/store/JobActionsContext";

const Page = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const userData = await checkAccess();
        if (!userData.hasAccess) {
          router.push("/pages/login");
        } else if (userData.role.toLowerCase() !== "employee") {
          router.push("/pages/home");
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error(error);
        router.push("/pages/login");
      }
    };

    validateAccess();
  }, [router]);

  if (!isAuthenticated) {
    return <p>...טוען</p>;
  }

  return (
    <JobActionsProvider>
      <div>
        <EmployeeDashboard />
      </div>
    </JobActionsProvider>
  );
};

export default Page;
