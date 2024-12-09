"use client"
import React, { useState } from "react";
import IUser from "../types/user";
import IEmployee from "../types/employee";
import ICandidate from "../types/candidate";
import { updateCandidate } from "../services/candidateServices";
import { updateEmployee } from "../services/employeeServices";

type Props = {
  user: IUser & (IEmployee | ICandidate);
};

const ProfilePage: React.FC<Props> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(user);

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value } as (IUser & ICandidate) | (IUser & IEmployee));
  };

  const handleSave = async () => {
    try {
      if (profileData.role === "candidate") {
        await updateCandidate(profileData.email, profileData);
      }
      if (profileData.role === "employee") {
        await updateEmployee(profileData.email, profileData);
      }
      setIsEditing(false);
    } catch (error) {
      console.error(error);

    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${isEditing ? "bg-white border-gray-300" : "bg-gray-100 border-gray-200"
              }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${isEditing ? "bg-white border-gray-300" : "bg-gray-100 border-gray-200"
              }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <input
            type="text"
            name="role"
            value={profileData.role}
            disabled
            className="mt-1 block w-full rounded-md bg-gray-100 border-gray-200 sm:text-sm"
          />
        </div>

        {profileData.role === "employee" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                name="company"
                value={(profileData as IEmployee).company}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${isEditing ? "bg-white border-gray-300" : "bg-gray-100 border-gray-200"
                  }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input
                type="text"
                name="position"
                value={(profileData as IEmployee).position}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${isEditing ? "bg-white border-gray-300" : "bg-gray-100 border-gray-200"
                  }`}
              />
            </div>
          </>
        )}

        {profileData.role === "candidate" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Experience</label>
              <input
                type="number"
                name="experience"
                value={(profileData as ICandidate).experience}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${isEditing ? "bg-white border-gray-300" : "bg-gray-100 border-gray-200"
                  }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Skills</label>
              <textarea
                name="skills"
                value={(profileData as ICandidate).skills.join(", ")}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${isEditing ? "bg-white border-gray-300" : "bg-gray-100 border-gray-200"
                  }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Resume Url</label>
              <input
                type="text"
                name="resumeUrl"
                value={(profileData as ICandidate).fileUrl}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${isEditing ? "bg-white border-gray-300" : "bg-gray-100 border-gray-200"
                  }`}
              />
            </div>
          </>
        )}
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleEditToggle}
            className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md shadow hover:bg-gray-700"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
