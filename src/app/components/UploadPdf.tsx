import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
// import { updateCandidate } from "../services/candidateServices";
import IUser from "../types/user";
import ICandidate from "../types/candidate";
import { updateCandidate, uploadResume } from "../services/candidateServices";


type Props = {
    user: (IUser & ICandidate) | null;
};
const UploadPdf: React.FC<Props> = ({ user }) => {

    const [file, setFile] = useState<File | null>(null);
    const [profileData, setProfileData] = useState(user);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            console.log("Selected file:", selectedFile)


        }
    };

    const handleSubmit = async () => {
        if (!file) {
            alert("Please select a file");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);

        try {
            if (profileData) {

                const resumeUrl = await uploadResume(file);
                console.log("resume url", resumeUrl)
                const updatedProfileData={ ...profileData, fileUrl: resumeUrl } as (IUser & ICandidate);
                setProfileData(updatedProfileData);
                console.log("profile data: ", updatedProfileData)
                const response = await updateCandidate(updatedProfileData.email, updatedProfileData);
                if (response) {
                    toast.success("Resume added succesfully!");
                } else {
                    toast.error("Error uploading file.");
                }
                // toast.success("Resume added succesfully!");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div className="p-4">
            <Toaster />
            <h1 className="text-2xl font-bold mb-4">Upload PDF</h1>
            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="block mb-4"
            />
            <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Upload
            </button>
        </div>
    );
}
export default UploadPdf;
