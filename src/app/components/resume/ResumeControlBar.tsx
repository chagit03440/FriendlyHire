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
      console.log("nameeeee", fileName);

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
          console.log("Resume saved succesfully!")
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
      <div className="sticky bottom-0 left-0 right-0 flex flex-wrap items-center justify-center gap-3 px-4 py-2 text-gray-600 sm:px-[var(--resume-padding)] lg:justify-between">
        {/* Left Section: Scale Controls */}
        <div className="flex flex-wrap items-center gap-3">
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
            className="w-36 sm:w-40 accent-orange-400"
          />
          <div className="w-12 text-center">{`${Math.round(scale * 100)}%`}</div>
          <label className="hidden items-center gap-2 lg:flex">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-orange-400"
              checked={scaleOnResize}
              onChange={() => setScaleOnResize((prev) => !prev)}
            />
            <span className="select-none">Autoscale</span>
          </label>
        </div>

        {/* Middle Section: Download Button */}
        <a
          className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100"
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

        {/* Right Section: Save Button */}
        <button
          className="flex w-full items-center justify-center gap-2 rounded-md bg-orange-400 px-4 py-2 text-white hover:bg-orange-500 sm:w-auto"
          onClick={handleSaveResume}
        >
          <span className="whitespace-nowrap text-sm">Save Resume</span>
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
