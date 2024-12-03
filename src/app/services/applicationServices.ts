import axios from "axios";
import IApplication from "../types/application";
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

export const createApplication=async(application:{userEmail: string; jobId: string; fileUrl: string; status:"Saved" | "Sent" | "Reviewed" | "Accepted" | "Rejected"})=>{
    try{
      const response = await axios.post('/api/application', application);
      const data = response.data;
      console.log('Application created:', data);
      return data;
    }catch(error){
      console.error('Error creating application:', error);
    }
  }

  export const updateApplication=async(id: string, application:{title: string; director:string; releaseYear:string})=>{
    try{
      const response = await axios.put(`/api/application/${id}`, application);
      const data = response.data;
      console.log('Application updated:', data);
      return data;
    }catch(error){
      console.error('Error updating application:', error);
    }
  }

  export const deleteApplication=async(id: string)=>{
    try{
      const response = await axios.delete(`/api/application/${id}`);
      const data = response.data;
      console.log('Application deleted:', data);
      return data;
    }catch(error){
      console.error('Error deleting application:', error);
    }
  }

  export const getUserApplications = async (userEmail: string| null) => {
    const applications = await getApplications()

    const filteredApplications = applications.filter(
      (application: IApplication) => application.userEmail === userEmail);

    return filteredApplications; // Returns a list of applications
  };
