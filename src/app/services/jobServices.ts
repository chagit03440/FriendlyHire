import axios from "axios";
import { Types } from "mongoose";

export const getJobs=async()=>{
  try{
    const response = await axios.get('/api/job');
    const data = response.data.jobs;
    return data;
  }catch(error){
    console.error('Error get jobs:', error);
  }
}

export const createJob=async(job:{title: string;
    description: string;
    experience: number;
    company: string;
    requirements: string[];
    location: string;
    status: "Open" | "Closed"; 
    createdBy: Types.ObjectId; })=>{
    try{
      const response = await axios.post('/api/job', job);
      const data = response.data;
      console.log('Job created:', data);
      return data;
    }catch(error){
      console.error('Error creating job:', error);
    }
  }

  export const updateJob=async(id: string, job:{title: string;
    description: string;
    experience: number;
    company: string;
    requirements: string[];
    location: string;
    status: "Open" | "Closed"; 
    createdBy: Types.ObjectId; })=>{
    try{
      const response = await axios.put(`/api/job/${id}`, job);
      const data = response.data;
      console.log('job updated:', data);
      return data;
    }catch(error){
      console.error('Error updating job:', error);
    }
  }

  export const deleteJob=async(id: string)=>{
    try{
      const response = await axios.delete(`/api/job/${id}`);
      const data = response.data;
      console.log('job deleted:', data);
      return data;
    }catch(error){
      console.error('Error deleting job:', error);
    }
  }