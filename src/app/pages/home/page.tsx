"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProtectedData } from "@/app/services/loginServices";

const Dashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAccess = async () => {
            const validation = await fetchProtectedData();
            console.log("validation data", validation);
            if (validation) {
                setIsAuthenticated(true);
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
            <p className="text-center">!הגעת בהצלחה לדף הראשי לאחר ההתחברות</p>
        </div>
    );
};

export default Dashboard;
