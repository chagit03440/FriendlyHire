import { useMemo } from "react";
import { RoleOptions } from "./types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { FaUser, FaSignOutAlt, FaRegListAlt } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { RiFileTextFill } from "react-icons/ri";


export const useRoleOptions = (
  router: AppRouterInstance,
  handleLogout: () => void
): RoleOptions => {
  return useMemo(
    () => ({
      admin: [
        {
          label: (
            <span className="flex items-center">
              <FaUser className="mr-2" />
              Profile
            </span>
          ),
          onClick: () => router.push("/pages/home/profile"),
        },
        {
          label: (
            <span className="flex items-center">
              <MdWork className="mr-2" />
              Manage Jobs
            </span>
          ),
          onClick: () => router.push("/pages/home/admin/jobs"),
        },
        {
          label: (
            <span className="flex items-center">
              <FaUser className="mr-2" />
              Manage Users
            </span>
          ),
          onClick: () => router.push("/pages/home/admin/users"),
        },
        {
          label: (
            <span className="flex items-center">
              <FaRegListAlt className="mr-2" />
              Manage Applications
            </span>
          ),
          onClick: () => router.push("/pages/home/admin/applications"),
        },
        {
          label: (
            <span className="flex items-center">
              <FaSignOutAlt className="mr-2" />
              Logout
            </span>
          ),
          onClick: handleLogout,
          style: "text-red-500 hover:bg-red-100",
        },
      ],
      employee: [
        {
          label: (
            <span className="flex items-center">
              <FaUser className="mr-2" />
              Profile
            </span>
          ),
          onClick: () => router.push("/pages/home/profile"),
        },
        {
          label: (
            <span className="flex items-center">
              <MdWork className="mr-2" />
              Post Job
            </span>
          ),
          onClick: () => router.push("/pages/home/employee/addJob"),
        },
        {
          label: (
            <span className="flex items-center">
              <RiFileTextFill className="mr-2" />
              My Posts
            </span>
          ),
          onClick: () => router.push("/pages/home"),
        },
        {
          label: (
            <span className="flex items-center">
              <FaSignOutAlt className="mr-2" />
              Logout
            </span>
          ),
          onClick: handleLogout,
          style: "text-red-500 hover:bg-red-100",
        },
      ],
      candidate: [
        {
          label: (
            <span className="flex items-center">
              <FaUser className="mr-2" />
              Profile
            </span>
          ),
          onClick: () => router.push("/pages/home/profile"),
        },
        {
          label: (
            <span className="flex items-center">
              <RiFileTextFill className="mr-2" />
              Resume
            </span>
          ),
          onClick: () => router.push("/pages/home/candidate/uploadResume"),
        },
        {
          label: (
            <span className="flex items-center">
              <MdWork className="mr-2" />
              My Applications
            </span>
          ),
          onClick: () => router.push("/pages/home/candidate/myJobs"),
        },
        {
          label: (
            <span className="flex items-center">
              <FaSignOutAlt className="mr-2" />
              Logout
            </span>
          ),
          onClick: handleLogout,
          style: "text-red-500 hover:bg-red-100",
        },
      ],
    }),
    [router, handleLogout]
  );
};
