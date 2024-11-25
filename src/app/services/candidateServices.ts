import axios from "axios";

export const updateCandidate = async (
  id: string,
  candidate: { experience: number; skills: string[]; fileUrl: string }
) => {
  try {
    const response = await axios.put(`/api/candidate/${id}`, candidate);
    const data = response.data;
    console.log("Candidate updated:", data);
    return data;
  } catch (error) {
    console.error("Error updating candidate:", error);
  }
};
