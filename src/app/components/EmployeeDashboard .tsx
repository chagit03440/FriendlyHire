import React from 'react'
import JobList from './JobList'; 

const EmployeeDashboard  = () => {
  return (
    <div className="employee-page">
      <h1 className="text-2xl font-bold">Available Jobs for Employees</h1>
      <JobList userRole="employee" /> {/* Passing role as 'employee' */}
    </div>
  )
}

export default EmployeeDashboard 

