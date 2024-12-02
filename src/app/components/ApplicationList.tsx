import React from "react";
import IApplication from "../types/application";

interface Props {
  applications: IApplication[];
}

const ApplicationList: React.FC<Props> = ({ applications }) => {
  return (
    <div className="application-list">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Job Title</th>
            <th className="border px-4 py-2 text-left">Company</th>
            <th className="border px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application._id}>
              <td className="border px-4 py-2">{application.jobId.id || "N/A"}</td>
              <td className="border px-4 py-2">{application.jobId?.id || "N/A"}</td>
              <td className="border px-4 py-2">{application.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationList;
