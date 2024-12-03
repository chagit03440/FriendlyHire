"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserApplications } from "@/app/services/applicationServices";
import { useUser } from "@/app/context/UserContext";
import ApplicationList from "@/app/components/ApplicationList";

const CandidateApplications = () => {
  const { mail, role } = useUser(); // Get the current user's email and role

  // Fetch applications for the current user using react-query
  const { data: applications = [], isLoading, error } = useQuery({
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
