import { supabase } from "../lib/supabase/supabaseClient";
import ICandidate from "../types/candidate";
import IUser from "../types/user";

export const uploadResume = async (
  file: File,
  profileData: IUser & ICandidate
): Promise<string | null> => {
  const fileName = `${Date.now()}-${file.name}`;
  const oldFileUrl = profileData.fileUrl;
  if (oldFileUrl) {
    await deleteResume(oldFileUrl);
  }
  const { data, error } = await supabase.storage
    .from("resumes")
    .upload(fileName, file);

  if (error) {
    console.error("Error uploading file:", error.message);
    return null;
  }
  if (data?.path) {
    const { data: publicUrlData } = supabase.storage
      .from("resumes")
      .getPublicUrl(data.path);

    if (!publicUrlData?.publicUrl) {
      console.error("Error retrieving public URL.");
      return null;
    }

    return publicUrlData.publicUrl;
  }
  return null;
};

export const deleteResume = async (oldFileUrl: string | null) => {
  //checking if existing old resume
  if (oldFileUrl) {
    //getting path file of old resume
    const bucketName = "resumes";
    const encodedFilePath = oldFileUrl.split(`${bucketName}/`)[1];
    const oldFilePath = decodeURIComponent(encodedFilePath);

    if (oldFilePath) {
      const { error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove([oldFilePath]);
      if (deleteError) {
        console.error("Error deleting old resume:", deleteError.message);
      } else {
        console.log("Old resume deleted successfully from Supabase.");
      }
    }
  }
};
