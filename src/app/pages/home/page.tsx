"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EmployeeDashboard from "@/app/components/employee/EmployeeDashboard ";
import CandidateDashboard from "@/app/components/candidate/CandidateDashboard";
import { useUser } from "@/app/store/UserContext";
import checkAccess from "@/app/utils/checkAccess";
import LoadSpinner from "@/app/components/common/LoadSpinner";
import AdminDashboard from "@/app/components/admin/AdminDashboard";

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [localRole, setLocalRole] = useState<string | null>(null); // Temporary role state
  const router = useRouter();
  const { setRole, setMail } = useUser();

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const userData = await checkAccess();

        if (!userData.hasAccess) {
          router.push("/pages/login");
          return;
        }

        // Update states after successful validation
        setLocalRole(userData.role.toLowerCase());
        setMail(userData.email);
        setRole(userData.role.toLowerCase());
        setIsAuthenticated(true);
      } catch (error) {
        console.error(error);
        router.push("/pages/login");
      }
    };

    validateAccess();
  }, [router, setRole, setMail]);

  if (!isAuthenticated) {
    return (
      <div>
        <LoadSpinner />
      </div>
    );
  }

  return (
    <div>
      {localRole === "employee" ? (
        <EmployeeDashboard />
      ) : localRole === "candidate" ? (
        <CandidateDashboard />
      ) : localRole === "admin" ? (
        <AdminDashboard />
      ) : (
        <p>Unrecognized Role</p> // Default message if role is undefined
      )}
    </div>
  );
};

export default Dashboard;
