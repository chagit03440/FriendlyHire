import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
// import { updateCandidate } from "../services/candidateServices";
import IUser from "../types/user";
import ICandidate from "../types/candidate";
import { updateCandidate, uploadResume } from "../services/candidateServices";
import { parseResumeFromPdf } from "../lib/parseResumeFromPdf";


type Props = {
    user: (IUser & ICandidate) | null;
};
const UploadPdf: React.FC<Props> = ({ user }) => {

    const [file, setFile] = useState<File | null>(null);
    const [profileData, setProfileData] = useState(user);
    const [isHoveredOnDropzone, setIsHoveredOnDropzone] = useState(false);

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
                if (resumeUrl) {
                    console.log("resume url", resumeUrl)
                    const updatedProfileData = { ...profileData, fileUrl: resumeUrl } as (IUser & ICandidate);
                    setProfileData(updatedProfileData);
                    console.log("profile data: ", updatedProfileData)
                    const response = await updateCandidate(updatedProfileData.email, updatedProfileData);
                    if (response) {
                        toast.success("Resume added succesfully!");
                    } else {
                        toast.error("Error uploading file.");
                    }              
                const resume = await parseResumeFromPdf(resumeUrl);//This row is checking for parse data
                console.log("rrrrrrr", resume);
                }
                else {
                    toast.error("Error getting url of file.");
                }
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div className="p-6 flex flex-col items-center justify-center space-y-4 bg-gray-50 min-h-screen">
            <Toaster />
            <div className={`w-full max-w-md rounded-lg border-2 border-dashed 
            ${isHoveredOnDropzone ? "border-sky-400" : "border-gray-300"} 
            p-6 flex flex-col items-center space-y-4 text-center bg-white shadow-md`}
                onDragOver={(event) => {
                    event.preventDefault();
                    setIsHoveredOnDropzone(true);
                }}
                onDragLeave={() => setIsHoveredOnDropzone(false)}
                onDrop={(event) => {
                    event.preventDefault();
                    const newFile = event.dataTransfer.files[0];
                    if (newFile && newFile.type === "application/pdf") {
                        setFile(newFile);
                        toast.success("File added successfully!");
                    } else {
                        toast.error("Only PDF files are supported.");
                    }
                    setIsHoveredOnDropzone(false);
                }}
            >
                <h1 className="text-xl font-semibold">Upload Your Resume</h1>
                {!file ? (
                    <>
                        <p className="text-gray-600">Drag and drop a PDF file here, or</p>
                        <label className="cursor-pointer inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Browse File
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    </>
                ) : (
                    <div className="flex items-center justify-between w-full">
                        <span className="truncate">{file.name}</span>
                        <button
                            type="button"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => setFile(null)}
                        >
                            Remove
                        </button>
                    </div>
                )}
            </div>
            {file && (
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                    Upload Resume
                </button>
            )}
            {profileData?.fileUrl && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Your Resume</h2>
                    <div className="border p-4 rounded-md shadow-sm">
                        <p className="mb-2">
                            <strong>File:</strong> {" "}
                            {(() => {
                                //return the name of file
                                const encodedFileName = profileData.fileUrl.split("/").pop();
                                if (encodedFileName) {
                                    // Decode the URL-encoded string and replace spaces with hyphens
                                    const decodedFileName = decodeURIComponent(encodedFileName);
                                    return decodedFileName.replace(/ /g, "-").split("-").slice(1).join("-");
                                }
                                return "";
                            })()}
                        </p>
                        <a
                            href={profileData.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            View or Download Resume
                        </a>
                        <div className="mt-4">
                            <iframe
                                src={profileData.fileUrl}
                                width="100%"
                                height="500px"
                                className="border"
                                title="Resume Preview"
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default UploadPdf;
