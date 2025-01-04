"use client"
import LoadSpinner from '@/app/components/common/LoadSpinner';
import { useUser } from '@/app/store/UserContext';
// import { QueryClient } from "@tanstack/react-query";
import checkAccess from '@/app/utils/checkAccess';
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react'

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { setRole, setMail } = useUser();
  const [loading, setLoading] = useState(true);
  // const [queryClient] = useState(() => new QueryClient());


  useEffect(() => {
    const validateAccess = async () => {
      try {
        const accessData = await checkAccess();

        if (!accessData.hasAccess) {
          // // Reset user state and query cache on logout
          // setRole(null);
          // setMail(null);
          // queryClient.clear(); // Clear all cached data

          router.push("/pages/login");
        } else {
          setRole(accessData.role.toLowerCase());
          setMail(accessData.email);
        }
      } catch (error) {
        console.error("Validation error:", error);
        setRole(null);
        setMail(null);
        // queryClient.clear(); // Clear all cached data

        router.push("/pages/login");
      } finally {
        setLoading(false); // Set loading to false when validation is done
      }
    };

    validateAccess();
  }, [router, setRole, setMail]);
  if (loading) {
    return <div><LoadSpinner /></div>; // You can replace this with a spinner or loading component
  }
  return (
    <div>
      {children}
    </div>
  )
}

export default HomeLayout
