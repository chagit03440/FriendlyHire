"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserApplications } from "@/app/services/applicationServices";
import { useUser } from "@/app/store/UserContext";
import ApplicationList from "@/app/components/ApplicationList";
import IApplication from "@/app/types/application";
import { JobActionsProvider } from "@/app/store/JobActionsContext";
import { ApplicationStatus } from "@/app/types/enums";
import { useRouter } from "next/navigation";
import checkAccess from "@/app/utils/checkAccess";

const CandidateApplications = () => {
  const { mail, role } = useUser(); // Get the current user's email and role
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | null>(
    null
  ); // Filter state

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const userData = await checkAccess();
        if (!userData.hasAccess) {
          router.push("/pages/login");
        } else if (userData.role.toLowerCase() !== "candidate") {
          router.push("/pages/home");
        } else {
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

  // Filter applications based on the selected status
  const filteredApplications = statusFilter
    ? applications.filter(
        (application: IApplication) => application.status === statusFilter
      )
    : applications;

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as ApplicationStatus | "all";
    setStatusFilter(value === "all" ? null : (value as ApplicationStatus)); // Set filter to null for "all"
  };

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <JobActionsProvider>
      <div className="candidate-page">
        <h1 className="text-2xl font-bold mb-4">My Job Applications</h1>
        {/* Filter options */}
        <div className="mb-4">
          <label htmlFor="status-filter" className="mr-2 font-medium">
            Filter by Status:
          </label>
          <select
            id="status-filter"
            value={statusFilter || "all"}
            onChange={handleStatusChange}
            className="px-3 py-2 border rounded"
          >
            <option value="all">All</option>
            {Object.values(ApplicationStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Application list */}
        {filteredApplications.length > 0 ? (
          <ApplicationList applications={filteredApplications} />
        ) : (
          <div>No applications found for the selected status.</div>
        )}
      </div>
    </JobActionsProvider>
  );
};

export default CandidateApplications;
