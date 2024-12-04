"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserApplications } from "@/app/services/applicationServices";
import { useUser } from "@/app/store/UserContext";
import ApplicationList from "@/app/components/ApplicationList";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import checkAccess from "@/app/store/checkAccess";

const CandidateApplications = () => {
  const router = useRouter();
  const { mail, role } = useUser(); // Move this before any conditional logic

  // Move the useQuery outside of any conditional rendering
  const {
    data: applications = [],
    isLoading,
  } = useQuery({
    queryKey: ["userApplications", mail],
    queryFn: () => getUserApplications(mail),
    enabled: !!mail && role === "candidate",
  });

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const userData = await checkAccess();
        if (
          !userData.hasAccess
        ) {
          router.push("/pages/login");
        }
        else if (userData.role.toLowerCase() !== "candidate") {
          router.push("/pages/home");
        }
      } catch (error) {
        console.error(error);
        router.push("/pages/login");
      }
    };

    validateAccess();
  }, [router]);

  // Handle loading state
  if (isLoading) return <div>Loading...</div>;

  // Render content
  return (
    <div className="candidate-page">
      <h1 className="text-2xl font-bold mb-4">My Job Applications</h1>

      {/* Application list */}
      {applications.length > 0 ? (
        <ApplicationList applications={applications} />
      ) : (
        <div>You have not applied for any jobs yet.</div>
      )}
    </div>
  );
};

export default CandidateApplications;
