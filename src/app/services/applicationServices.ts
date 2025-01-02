import axios from "axios";
import IApplication from "../types/application";
import { ApplicationStatus } from "../types/enums";
//import { Types } from "mongoose";

export const getApplications=async()=>{
  try{
    const response = await axios.get('/api/application');
    const data = response.data;
    return data;
  }catch(error){
    console.error('Error get applications:', error);
  }
}

export const getApplicationById = async (applicationId: string) => {
  try {
    const response = await axios.get(`/api/application/${applicationId}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error)
  }
};

export const createApplication=async(application:{userEmail: string; jobId: string; fileUrl: string; status:ApplicationStatus})=>{
    try{
      const response = await axios.post('/api/application', application);
      const data = response.data;
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  export const updateApplication = async (application: IApplication) => {
    try {
      const response = await axios.put(`/api/application/${application._id}`, application);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        // Check if the error is related to the job being closed
        if (error.response.data.message.includes("job is closed")) {
          throw new Error("Cannot update the application because the job is closed.");
        }
      }
      console.error("Error updating application:", error);
      throw new Error("An unexpected error occurred while updating the application.");
    }
  };
  

  export const deleteApplication=async(id: string)=>{
    try{
      const response = await axios.delete(`/api/application/${id}`);
      const data = response.data;
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  export const getUserApplications = async (userEmail: string| null) => {
    const applications = await getApplications()

    const filteredApplications = applications.filter(
      (application: IApplication) => application.userEmail === userEmail);

    return filteredApplications; // Returns a list of applications
  };

  export const getJobApplications = async (jobId: string| null) => {
    const applications = await getApplications()

    const filteredApplications = applications.filter(
      (application: IApplication) => application.jobId._id === jobId);

    return filteredApplications; // Returns a list of applications
  };
