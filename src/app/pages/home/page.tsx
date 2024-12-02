"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { fetchProtectedData } from "@/app/services/loginServices";
import EmployeeDashboard from "@/app/components/EmployeeDashboard ";
import CandidateDashboard from "@/app/components/CandidateDashboard";
import { useUser } from "@/app/context/UserContext";


const Dashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // const [userRole, setUserRole] = useState<string | null>(null);
    const router = useRouter();
    const { role, setRole } = useUser();

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const validation = await fetchProtectedData();
                console.log("validation data", validation);

                if (validation?.role) {
                    setIsAuthenticated(true);
                    setRole(validation.role.toLowerCase()); 
                    // setUserRole(validation.role.toLowerCase());
                    toast.success("!הגעת בהצלחה לדף הראשי לאחר ההתחברות");
                    console.log("יש לך גישה למידע המוגן:", validation);
                } else {
                    throw new Error("Unauthorized");
                }
            } catch (error) {
                console.error("Access denied:", error);
                router.push("/pages/login");
            }
        };
        checkAccess();
    }, [router]);

    if (!isAuthenticated) {
        return <p>...טוען</p>;
    }

    return (
        <div className="">
            <Toaster />
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
