"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserApplications } from "@/app/services/applicationServices";
import { useUser } from "@/app/store/UserContext";
import ApplicationList from "@/app/components/ApplicationList";
import IApplication from "@/app/types/application";
import { JobActionsProvider } from "@/app/store/JobActionsContext";
import { ApplicationStatus } from "@/app/types/enums";
import LoadSpinner from "@/app/components/common/LoadSpinner";

const CandidateApplications = () => {
  const { mail, role } = useUser();
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | null>(
    null
  );

  const {
    data: applications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userApplications", mail],
    queryFn: () =>
      mail && role === "candidate"
        ? getUserApplications(mail)
        : Promise.resolve([]),
    enabled: !!mail,
  });

  const filteredApplications = statusFilter
    ? applications.filter(
        (application: IApplication) => application.status === statusFilter
      )
    : applications;

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as ApplicationStatus | "all";
    setStatusFilter(value === "all" ? null : (value as ApplicationStatus));
  };

  if (isLoading)
    return (
      <div>
        <LoadSpinner />
      </div>
    );
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <JobActionsProvider>
      <div className="candidate-page">
        <h1 className="text-2xl font-bold mb-4">My Job Applications</h1>
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
