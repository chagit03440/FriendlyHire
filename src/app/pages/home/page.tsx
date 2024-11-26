"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { fetchProtectedData } from "@/app/services/loginServices";
import { useRoleStore } from "../store/userStore";
import EmployeeDashboard from "@/app/components/EmployeeDashboard "; // Import Employee component
import CandidateDashboard from "@/app/components/CandidateDashboard"; // Import Candidate component


const Dashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const role = useRoleStore((state) => state.role);

    useEffect(() => {
        const checkAccess = async () => {
            const validation = await fetchProtectedData();
            console.log("validation data", validation);
            if (validation) {
                setIsAuthenticated(true);
                toast.success("!הגעת בהצלחה לדף הראשי לאחר ההתחברות");
                console.log("יש לך גישה למידע המוגן:", validation);
            } else {
                router.push("/pages/login"); // אם אין token, החזר לדף הלוגין
                console.log("אין לך גישה למידע המוגן");
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
