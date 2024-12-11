import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
// import { updateCandidate } from "../services/candidateServices";
import IUser from "../types/user";
import ICandidate from "../types/candidate";
import IEmployee from "../types/employee";
// import { useUser } from "../store/UserContext";

type Props = {
    user: IUser & ICandidate | IUser & IEmployee
    | null;
};
const UploadPdf: React.FC<Props> = ({ user }) => {
    
    const [file, setFile] = useState<File | null>(null);
    const [profileData, setProfileData] = useState(user);
    // const { mail } = useUser(); 

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            console.log("Selected file:", selectedFile)
            setProfileData({ ...profileData, fileUrl: selectedFile } as (IUser & ICandidate));

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
            console.log("resumeeeeeeeeeeeeeee", profileData)
            // const response = await updateCandidate(mail, profileData);
            // if (response) {
            //     toast.success("Resume added succesfully!");
            // } else {
            //     toast.error("Error uploading file.");
            // }
            toast.success("Resume added succesfully!");
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
