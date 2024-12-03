"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserApplications } from "@/app/services/applicationServices";
import { useUser } from "@/app/store/UserContext";
import ApplicationList from "@/app/components/ApplicationList";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import checkAccess from "@/app/store/checkAccess";

const CandidateApplications = () => {
  const { mail, role } = useUser(); // Get the current user's email and role

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const userData = await checkAccess();
        if (!userData.hasAccess) {
          router.push("/pages/login");
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        router.push("/pages/login");
      }
    };

    validateAccess();
  }, [router]);

  if (!isAuthenticated) {
    return <p>...טוען</p>;
  }

  // Fetch applications for the current user using react-query
  const {
    data: applications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userApplications", mail],
    queryFn: () => getUserApplications(mail), // Fetch user-specific applications
    enabled: !!mail && role === "candidate", // Only fetch if mail exists and user is a candidate
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

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
