"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserApplications } from "@/app/services/applicationServices";
import { useUser } from "@/app/store/UserContext";
import ApplicationList from "@/app/components/applications/ApplicationList";
import IApplication from "@/app/types/application";
import { JobActionsProvider } from "@/app/store/JobActionsContext";
import { ApplicationStatus } from "@/app/types/enums";
import LoadSpinner from "@/app/components/common/LoadSpinner";

const CandidateApplications = () => {
  const { mail, role } = useUser();
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | null>(null);
  const [statusCount, setStatusCount] = useState<Record<string, number>>({});

  const {
    data: applications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userApplications", mail],
    queryFn: () =>
      mail && role === "candidate" ? getUserApplications(mail) : Promise.resolve([]),
    enabled: !!mail,
  });

  useEffect(() => {
    // Calculate status counts once when the data is fetched
    const counts = applications.reduce((acc: { [x: string]: number; }, application: { status: any; }) => {
      const status = application.status;
      if (!acc[status]) {
        acc[status] = 0;
      }
      acc[status]++;
      return acc;
    }, {} as Record<string, number>);
    setStatusCount(counts);
  }, [applications]); // Recalculate count if applications change

  const filteredApplications = statusFilter
    ? applications.filter((application: IApplication) => application.status === statusFilter)
    : applications;

  const handleStatusChange = (status: ApplicationStatus | "all") => {
    setStatusFilter(status === "all" ? null : (status as ApplicationStatus));
  };

  if (isLoading) return <div><LoadSpinner /></div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <JobActionsProvider>
      <div className="candidate-page bg-white text-black p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">My Job Applications</h1>

        {/* Status Filters and Count */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleStatusChange("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                statusFilter === null ? "bg-orange-500 text-white" : "bg-gray-200 text-black"
              } hover:bg-orange-600 hover:text-white`}
            >
              All ({applications.length})
            </button>
            {Object.values(ApplicationStatus).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                  statusFilter === status ? "bg-orange-500 text-white" : "bg-gray-200 text-black"
                } hover:bg-orange-600 hover:text-white`}
              >
                {status} ({statusCount[status] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Application List */}
        {filteredApplications.length > 0 ? (
          <ApplicationList applications={filteredApplications} />
        ) : (
          <div className="text-center text-gray-400">No applications found for the selected status.</div>
        )}
      </div>
    </JobActionsProvider>
  );
};

export default CandidateApplications;
