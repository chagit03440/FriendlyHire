import React from 'react';
import IJob from '../types/job'; 

interface JobCardProps {
  job: IJob;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="border p-4 rounded shadow-lg">
      <h3 className="text-xl font-bold">{job.title}</h3>
      <p className="text-sm text-gray-500">{job.company}</p>
      <p className="text-gray-700 mt-2">{job.description}</p>
      <div className="mt-2">
        <span className="font-semibold">Experience Required:</span> {job.experience} years
      </div>
      <div className="mt-2">
        <span className="font-semibold">Location:</span> {job.location}
      </div>
      <div className="mt-2">
        <span className="font-semibold">Requirements:</span>
        <ul className="list-disc ml-4">
          {job.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <span className="font-semibold">Status:</span> {job.status}
      </div>
    </div>
  );
};

export default JobCard;
