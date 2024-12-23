"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import checkAccess from "@/app/utils/checkAccess";
import LoadSpinner from "@/app/components/LoadSpinner";
import IUser from "@/app/types/user";
import ICandidate from "@/app/types/candidate";
import { useUser } from "@/app/store/UserContext";
import { getCandidate } from "@/app/services/candidateServices";
import UploadPdf from "@/app/components/resume/UploadPdf";

const Page = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<
    (IUser & ICandidate) | null
  >(null);
  const router = useRouter();
  const { mail } = useUser();


  useEffect(() => {
    const validateAccess = async () => {
      try {
        const userData = await checkAccess();
        if (!userData.hasAccess) {
          router.push("/pages/login");
        } else if (userData.role.toLowerCase() !== "candidate") {
          router.push("/pages/home");
        } else {
          const thisUser = await getCandidate(mail);
          setUser(thisUser);
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
    return <div> <LoadSpinner /> </div>;
  }

  return <div><UploadPdf user={user} /></div>;
};

export default Page;
