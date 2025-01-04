import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import IUser from "../../types/user";
import ICandidate from "../../types/candidate";
import { updateCandidate } from "../../services/candidateServices";
import { parseResumeFromPdf } from "../../lib/parseResumeFromPdf";
import { deepClone } from "../../lib/deepClone";
import { initialSettings, ShowForm } from "../../lib/redux/settingsSlice";
import { getHasUsedAppBefore, saveStateToLocalStorage } from "../../lib/redux/local-storage";
import { useRouter } from "next/navigation";
import { uploadResume } from "@/app/services/resumeServices";
import { FaEdit, FaEye } from "react-icons/fa";

type Props = {
    user: (IUser & ICandidate) | null;
};
const UploadPdf: React.FC<Props> = ({ user }) => {
    const [file, setFile] = useState<File | null>(null);
    const [profileData, setProfileData] = useState(user);
    const [isHoveredOnDropzone, setIsHoveredOnDropzone] = useState(false);
    const router = useRouter();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            console.log("Selected file:", selectedFile);
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
                const resumeUrl = await uploadResume(file, profileData);
                if (resumeUrl) {
                    console.log("url new:", resumeUrl);
                    const updatedProfileData = { ...profileData, fileUrl: resumeUrl } as (IUser & ICandidate);
                    setProfileData(updatedProfileData);
                    const response = await updateCandidate(updatedProfileData.email, updatedProfileData);
                    if (response) {
                        toast.success("Resume added successfully!");
                    } else {
                        toast.error("Error uploading file.");
                    }
                } else {
                    toast.error("Error getting URL of file.");
                }
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };
    const handleEdit = async () => {
        const resume = await parseResumeFromPdf(String(profileData?.fileUrl));
        // console.log("resume", resume);
        const settings = deepClone(initialSettings);
        if (getHasUsedAppBefore()) {
            const sections = Object.keys(settings.formToShow) as ShowForm[];
            const sectionToFormToShow: Record<ShowForm, boolean> = {
                workExperiences: resume.workExperiences.length > 0,
                educations: resume.educations.length > 0,
                projects: resume.projects.length > 0,
                skills: resume.skills.descriptions.length > 0,
                custom: resume.custom.descriptions.length > 0,
            };
            for (const section of sections) {
                settings.formToShow[section] = sectionToFormToShow[section];
            }
            saveStateToLocalStorage({ resume, settings });
        }
        router.push("/pages/home/candidate/buildResume");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Toaster />
            <h1 className="text-center text-3xl font-bold mb-6">Your Resume</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="bg-white shadow-md p-6 rounded-lg">
                    <div
                        className={`w-full rounded-lg border-2 border-dashed ${isHoveredOnDropzone ? "border-sky-400" : "border-gray-300"
                            } p-6 flex flex-col items-center space-y-4 text-center`}
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
                                <label className="cursor-pointer inline-block bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
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
                            <div className="flex flex-col items-center w-full">
                                <div className="flex flex-row items-center justify-between space-x-4 w-full">
                                    <span className="truncate">{file.name}</span>
                                    <button
                                        type="button"
                                        className="text-red-400 hover:text-red-700"
                                        onClick={() => setFile(null)}
                                    >
                                        Remove
                                    </button>
                                </div>
                                {file && (
                                    <div className="flex justify-center items-center h-full pt-2">
                                        <button className=" bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800" onClick={() => handleSubmit()}>
                                            Upload Resume
                                        </button>
                                    </div>
                                )}
                            </div>

                        )}
                    </div>

                    <div className="mb-4 p-4 bg-orange-50 border-l-4 border-orange-400 rounded-lg">
                        <h2 className="text-orange-400 font-semibold text-lg">Important Guidelines</h2>
                        <p className="text-gray-700 mt-2 text-sm">
                            Please upload your resume as a PDF file. Ensure that:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 mt-2 text-sm">
                            <li>The file is in English.</li>
                            <li>The file name is in English characters.</li>
                        </ul>
                    </div>
                </div>

                <div className="col-span-2 bg-white shadow-md p-6 rounded-lg">
                    {profileData?.fileUrl ? (
                        <div className="border p-4 rounded-md shadow-sm">
                            <p className="mb-2">
                                <strong>File:</strong>{" "}
                                {decodeURIComponent(profileData.fileUrl.split("/").pop() || "").split("-").slice(1).join("-")}
                            </p>
                            <div className="flex space-x-6 mb-4">
                                {/* View Resume Button */}
                                <div className="group relative flex items-center space-x-2">
                                    <button
                                        onClick={() => {
                                            if (profileData?.fileUrl) {
                                                window.open(profileData.fileUrl, "_blank");
                                            } else {
                                                toast.error("No file URL found.");
                                            }
                                        }}
                                        className="w-12 h-12 flex justify-center items-center rounded-full text-orange-400 bg-transparent hover:bg-orange-400 hover:text-white transition-all duration-200"
                                    >
                                        <FaEye className="text-3xl" />
                                    </button>
                                    <span className="text-orange-400 group-hover:text-orange-500 font-medium transition-all duration-200">
                                        View Resume
                                    </span>
                                </div>

                                {/* Edit Resume Button */}
                                <div className="group relative flex items-center space-x-2">
                                    <button
                                        onClick={handleEdit}
                                        className="w-12 h-12 flex justify-center items-center rounded-full text-orange-400 bg-transparent hover:bg-orange-400 hover:text-white transition-all duration-200"
                                    >
                                        <FaEdit className="text-3xl" />
                                    </button>
                                    <span className="text-orange-400 group-hover:text-orange-500 font-medium transition-all duration-200">
                                        Edit Resume
                                    </span>
                                </div>
                            </div>

                            <iframe
                                src={profileData.fileUrl}
                                className="w-full h-[600px] border rounded-md"
                                title="Resume Preview"
                            ></iframe>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center">
                            No resume uploaded yet. Please use the form to the right to upload a PDF.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadPdf;
