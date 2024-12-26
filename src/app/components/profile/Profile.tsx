"use client"
import React, { useState } from "react";
import IUser from "@/app/types/user";
import IEmployee from "@/app/types/employee";
import ICandidate from "@/app/types/candidate";
import { updateCandidate } from "@/app/services/candidateServices";
import { updateEmployee } from "@/app/services/employeeServices";
import { updateUser } from "@/app/services/userServices";

type Props = {
  user: IUser & (IEmployee | ICandidate);
};

const ProfilePage: React.FC<Props> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState<string>("");
  const [profileData, setProfileData] = useState(user);

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "skills") {
      // Split the skills string into an array
      setProfileData((prevData) => ({
        ...prevData,
        skills: value.split(",").map((skill) => skill.trim()),
      } as (IUser & ICandidate) | (IUser & IEmployee)));
    } else {
      setProfileData({ ...profileData, [name]: value } as (IUser & ICandidate) | (IUser & IEmployee));
    }
  };

  const handleSave = async () => {
    try {
      if (profileData.role === "candidate") {
        await updateCandidate(profileData.email, profileData);
      }
      if (profileData.role === "employee") {
        await updateEmployee(profileData.email, profileData);
      }
      if (profileData.role === "admin") {
        await updateUser(profileData.email, profileData);
      }
      setIsEditing(false);
    } catch (error) {
      console.error(error);

    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    console.log(skillToRemove);
    setProfileData({
      ...profileData,
      skills: (profileData as ICandidate).skills.filter((skill) => skill !== skillToRemove)
    } as (IUser & ICandidate) | (IUser & IEmployee));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !(profileData as ICandidate).skills.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...(profileData as ICandidate).skills, newSkill.trim()]
      } as (IUser & ICandidate) | (IUser & IEmployee));
      setNewSkill("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-4 text-center">Profile</h1>
      <div className="space-y-4">
        <div>
          <label className="mb-4 text-xl font-bold text-gray-800">Name</label>
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
          <label className="mb-4 text-xl font-bold text-gray-800">Email</label>
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
          <label className="mb-4 text-xl font-bold text-gray-800">Role</label>
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
              <label className="mb-4 text-xl font-bold text-gray-800">Company</label>
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
              <label className="mb-4 text-xl font-bold text-gray-800">Position</label>
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
              <label className="mb-4 text-xl font-bold text-gray-800">Experience</label>
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
              <h2 className="mb-4 text-xl font-bold text-gray-800">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {(profileData as ICandidate).skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1 shadow-md">
                    <span>{skill}</span>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Remove ${skill}`}
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <div className="mt-4 flex items-center gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a new skill"
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="rounded-md bg-blue-500 px-4 py-2 text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Add
                  </button>
                </div>
              )}
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
