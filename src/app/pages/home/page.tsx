"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EmployeeDashboard from "@/app/components/EmployeeDashboard ";
import CandidateDashboard from "@/app/components/CandidateDashboard";
import { useUser } from "@/app/store/UserContext";
import checkAccess from "@/app/utils/checkAccess";
import LoadSpinner from "@/app/components/LoadSpinner";

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();
  const { role, setRole, setMail } = useUser();

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const userData = await checkAccess();
        if (!userData.hasAccess) {
          router.push("/pages/login");
        } else {
          setIsAuthenticated(true);
          setRole(userData.role.toLowerCase());
          setMail(userData.email);
        }
      } catch (error) {
        console.error(error);
        router.push("/pages/login");
      }
    };

    validateAccess();
  }, [router]);

  if (!isAuthenticated) {
    return (
      <p>
        <LoadSpinner />
      </p>
    );
  }

  return (
    <div className="">
      <div>
        {role === "employee" ? (
          <EmployeeDashboard />
        ) : role === "candidate" ? (
          <CandidateDashboard />
        ) : (
          <p>תפקיד לא מזוהה</p> // Default message if role is undefined
        )}
      </div>
    </div>
  );
};

export default Dashboard;
