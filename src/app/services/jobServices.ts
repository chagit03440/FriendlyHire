import axios from "axios";
import IJob from "../types/job";

export const getJobs=async()=>{
  try{
    const response = await axios.get('/api/job');
    const data = response.data;
    console.log(data)

    return data;
  }catch(error){
    console.error('Error get jobs:', error);
  }
}

export const getJobById = async (jobId: string) => {
  try {
    const response = await axios.get(`/api/job/${jobId}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error)
  }
};

export const createJob=async(job:{title: string;
    description: string;
    experience: number;
    company: string;
    requirements: string[];
    location: string;
    status: string; 
    createdBy: string; })=>{
    try{
      const response = await axios.post('/api/job', job);
      const data = response.data;
      return data;
    }catch(error){
      console.error('Error creating job:', error);
    }
  }

  export const updateJob=async(job:IJob)=>{

    try{
      const response = await axios.put(`/api/job/${job._id}`, job);
      const data = response.data;
      return data;
    }catch(error){
      console.error('Error updating job:', error);
    }
  }

  export const deleteJob=async(id: string)=>{
    try{
      const response = await axios.delete(`/api/job/${id}`);
      const data = response.data;
      return data;
    }catch(error){
      console.error('Error deleting job:', error);
    }
  }