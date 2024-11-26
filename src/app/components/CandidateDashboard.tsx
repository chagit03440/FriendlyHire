import React from 'react';
import JobList from './JobList'; 

const CandidateDashboard: React.FC = () => {
  return (
    <div className="candidate-page">
      <h1 className="text-2xl font-bold">Available Jobs for Candidates</h1>
      <JobList userRole="candidate" /> {/* Passing role as 'candidate' */}
    </div>
  );
};

export default CandidateDashboard;
