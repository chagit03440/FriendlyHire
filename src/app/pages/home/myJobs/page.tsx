"use client";

import React from "react";
//import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getApplications } from "@/app/services/applicationServices";
import { useUser } from "@/app/context/UserContext";
import IApplication from "@/app/types/application";
import ApplicationList from "@/app/components/ApplicationList";

const CandidateApplications = () => {
 // const router = useRouter(); // Initialize useRouter
  const { mail, role } = useUser(); // Get the current user's email and role

  // Fetch all applications using react-query
  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications, // Fetch applications service
  });

  // Filter applications based on the candidate's email
  const filteredApplications =
    role === "candidate"
      ? applications.filter(
          (application: IApplication) => application.userEmail === mail
        )
      : [];

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div className="candidate-page">
      <h1 className="text-2xl font-bold mb-4">My Job Applications</h1>

      {/* Application list */}
      {filteredApplications.length > 0 ? (
        <ApplicationList applications={filteredApplications} />
      ) : (
        <div>You have not applied for any jobs yet.</div>
      )}
    </div>
  );
};

export default CandidateApplications;
