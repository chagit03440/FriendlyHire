"use client";
import { useEffect } from "react";
import { useSetDefaultScale } from "./hooks";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { usePDF } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { getCandidate, updateCandidate } from "@/app/services/candidateServices";
import { useUser } from "@/app/store/UserContext";
import { uploadResume } from "@/app/services/resumeServices";
import IUser from "@/app/types/user";
import ICandidate from "@/app/types/candidate";
import toast, { Toaster } from "react-hot-toast";

const ResumeControlBar = ({
  scale,
  setScale,
  documentSize,
  document,
  fileName,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  document: JSX.Element;
  fileName: string;
}) => {
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });
  const [instance, update] = usePDF({ document });
  const { mail } = useUser();

  // Hook to update pdf when document changes
  useEffect(() => {
    if (document) {
      update(document);
    }
  }, [update, document]);

  const handleSaveResume = async () => {

    if (!instance.blob) {
      console.error("PDF generation failed or not ready");
      return;
    }
    try {

      const file = new File([instance.blob], fileName, { type: instance.blob.type });

      const formData = new FormData();
      formData.append("file", file);

      const thisUser = await getCandidate(mail);
      const resumeUrl = await uploadResume(file, thisUser);
      if (resumeUrl) {
        const updatedProfileData = { ...thisUser, fileUrl: resumeUrl } as (IUser & ICandidate);
        const response = await updateCandidate(updatedProfileData.email, updatedProfileData);
        if (response) {
          toast.success("Resume saved succesfully!");
        } else {
          toast.error("Error saving file.");
        }
      }
      else {
        console.error("Error getting url of file.");
      }
    }
    catch (error) {
      console.error("Error saving resume:", error);
      toast.error("Failed to save resume. Please try again.");
    }


  }

  return (
    <>
      <Toaster />
      <div className="sticky bottom-0 left-0 right-0 flex h-[var(--resume-control-bar-height)] items-center justify-center px-[var(--resume-padding)] text-gray-600 lg:justify-between">
        <div className="flex items-center gap-2">
          <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
          <input
            type="range"
            min={0.5}
            max={1.5}
            step={0.01}
            value={scale}
            onChange={(e) => {
              setScaleOnResize(false);
              setScale(Number(e.target.value));
            }}
            className="w-32 accent-orange-400"
          />
          <div className="w-10">{`${Math.round(scale * 100)}%`}</div>
          <label className="hidden items-center gap-1 lg:flex">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-orange-400"
              checked={scaleOnResize}
              onChange={() => setScaleOnResize((prev) => !prev)}
            />
            <span className="select-none">Autoscale</span>
          </label>
        </div>
        <a
          className="ml-1 flex items-center gap-1 rounded-md border border-gray-300 px-3 py-0.5 hover:bg-gray-100 lg:ml-4"
          href={instance.url || "#"}
          download={fileName}
          onClick={(e) => {
            if (!instance.url) {
              e.preventDefault();
              console.error("PDF generation failed or not ready");
            }
          }}
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span className="whitespace-nowrap">Download Resume</span>
        </a>
        <button
          className="ml-4 flex items-center gap-1 rounded-md bg-orange-400 px-3 py-0.5 text-white hover:bg-orange-500 w-full sm:w-auto"
          onClick={handleSaveResume}
        >
          <span className="whitespace-nowrap">Save Resume</span>
        </button>

      </div>
    </>
  );
};

/**
 * Load ResumeControlBar client side since it uses usePDF, which is a web specific API
 */
export const ResumeControlBarCSR = dynamic(
  () => Promise.resolve(ResumeControlBar),
  {
    ssr: false,
  }
);

export const ResumeControlBarBorder = () => (
  <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50" />
);
