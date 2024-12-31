"use client"
import React, { useState } from "react";
import IUser from "@/app/types/user";
import IEmployee from "@/app/types/employee";
import ICandidate from "@/app/types/candidate";
import { updateCandidate } from "@/app/services/candidateServices";
import { updateEmployee } from "@/app/services/employeeServices";
import { updateUser } from "@/app/services/userServices";
import ButtonLink from "../common/Button";
import Image from "next/image";

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
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-0 border border-gray-200">
      <div className="relative mb-8">
        <div className="h-32 bg-orange-500 rounded-t-lg"></div>
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1">
          <Image
            src="/imgs/logo2.png"
            alt="Profile"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>
      </div>

      <div className="text-center mt-16 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">{profileData.name}</h1>
        <p className="text-sm text-gray-500">{profileData.email}</p>
      </div>
      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <div>
            <label className="block text-lg font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`mt-2 block w-full rounded-md border-2 p-2 text-gray-700 ${isEditing ? "bg-white" : "bg-gray-100"} shadow-sm`}
            />
          </div>

          <div className="mt-4">
            <label className="block text-lg font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              disabled
              className="mt-2 block w-full rounded-md bg-gray-100 border-2 p-2 text-gray-500 shadow-sm"
            />
          </div>

          <div className="mt-4">
            <label className="block text-lg font-medium text-gray-700">Role</label>
            <input
              type="text"
              name="role"
              value={profileData.role}
              disabled
              className="mt-2 block w-full rounded-md bg-gray-100 border-2 p-2 text-gray-500 shadow-sm"
            />
          </div>
        </div>

        {profileData.role === "employee" && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div>
              <label className="block text-lg font-medium text-gray-700">Company</label>
              <input
                type="text"
                name="company"
                value={(profileData as IEmployee).company}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-2 block w-full rounded-md border-2 p-2 text-gray-700 ${isEditing ? "bg-white" : "bg-gray-100"} shadow-sm`}
              />
            </div>

            <div className="mt-4">
              <label className="block text-lg font-medium text-gray-700">Position</label>
              <input
                type="text"
                name="position"
                value={(profileData as IEmployee).position}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-2 block w-full rounded-md border-2 p-2 text-gray-700 ${isEditing ? "bg-white" : "bg-gray-100"} shadow-sm`}
              />
            </div>
          </div>
        )}

        {profileData.role === "candidate" && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div>
              <label className="block text-lg font-medium text-gray-700">Experience</label>
              <input
                type="number"
                name="experience"
                value={(profileData as ICandidate).experience}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-2 block w-full rounded-md border-2 p-2 text-gray-700 ${isEditing ? "bg-white" : "bg-gray-100"} shadow-sm`}
              />
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-semibold text-gray-700">Skills</h2>
              <div className="flex flex-wrap gap-3">
                {(profileData as ICandidate).skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-md px-4 py-2 shadow-md">
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
                    className="flex-1 rounded-md border-2 p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <ButtonLink onClick={handleAddSkill} text="Add" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        {isEditing ? (
          <ButtonLink onClick={handleSave} text="Save" />
        ) : (
          <ButtonLink onClick={handleEditToggle} text="Edit" />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
