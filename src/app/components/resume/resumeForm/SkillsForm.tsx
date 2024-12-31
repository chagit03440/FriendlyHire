import { Form } from "./form/Form";
import {
  BulletListTextarea,
  InputGroupWrapper,
} from "./form/InputGroup";
import { FeaturedSkillInput } from "./form/FeaturedSkillInput";
import { BulletListIconButton } from "./form/IconButton";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import { selectSkills, changeSkills } from "@/app/lib/redux/resumeSlice";
import {
  selectShowBulletPoints,
  changeShowBulletPoints,
  selectThemeColor,
} from "@/app/lib/redux/settingsSlice";
import { getCandidate, updateCandidate } from "@/app/services/candidateServices";
import { useUser } from "@/app/store/UserContext";
import toast from "react-hot-toast";

export const SkillsForm = () => {
  const skills = useAppSelector(selectSkills);
  const dispatch = useAppDispatch();
  const { featuredSkills, descriptions } = skills;
  const form = "skills";
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));
  const themeColor = useAppSelector(selectThemeColor) || "#38bdf8";
  const { mail } = useUser();

  const handleSkillsChange = (field: "descriptions", value: string[]) => {
    dispatch(changeSkills({ field, value }));
  };
  const handleFeaturedSkillsChange = (
    idx: number,
    skill: string,
    rating: number
  ) => {
    dispatch(changeSkills({ field: "featuredSkills", idx, skill, rating }));
  };
  const handleShowBulletPoints = (value: boolean) => {
    dispatch(changeShowBulletPoints({ field: form, value }));
  };
  const handleAddSkillsToProfile = async () => {
    try {
      const thisUser = await getCandidate(mail);
      if (!thisUser || !thisUser.skills) {
        console.error("User or skills not found");
        return;
      }
      const mergedSkills = Array.from(
        new Set([...thisUser.skills, ...descriptions])
      );
      const updatedUser = {
        ...thisUser,
        skills: mergedSkills,
      };
      await updateCandidate(String(mail), updatedUser);
      console.log("Skills successfully updated:", mergedSkills);
      toast.success("Skills added successfully!");
    } catch (error) {
      console.error("Error adding skills to profile:", error);
    }

  }

  return (
    <Form form={form}>
      <div className="col-span-full grid grid-cols-6 gap-3">
        <div className="relative col-span-full">
          <BulletListTextarea
            label="Skills List"
            labelClassName="col-span-full"
            name="descriptions"
            placeholder="Bullet points"
            value={descriptions}
            onChange={handleSkillsChange}
            showBulletPoints={showBulletPoints}
          />
          <div className="absolute left-[4.5rem] top-[0.07rem]">
            <BulletListIconButton
              showBulletPoints={showBulletPoints}
              onClick={handleShowBulletPoints}
            />
          </div>
          <div className="mt-4 flex justify-start">
            <a
              href="#"
              className="text-blue-600 underline hover:text-blue-800"
              onClick={handleAddSkillsToProfile}
            >
              Would you like to add these skills to your profile?
            </a>
          </div>
        </div>
        <div className="col-span-full mb-4 mt-6 border-t-2 border-dotted border-gray-200" />
        <InputGroupWrapper
          label="Featured Skills (Optional)"
          className="col-span-full"
        >
          <p className="mt-2 text-sm font-normal text-gray-600">
            Featured skills is optional to highlight top skills, with more
            circles mean higher proficiency.
          </p>
        </InputGroupWrapper>

        {featuredSkills.map(({ skill, rating }, idx) => (
          <FeaturedSkillInput
            key={idx}
            className="col-span-3"
            skill={skill}
            rating={rating}
            setSkillRating={(newSkill, newRating) => {
              handleFeaturedSkillsChange(idx, newSkill, newRating);
            }}
            placeholder={`Featured Skill ${idx + 1}`}
            circleColor={themeColor}
          />
        ))}
      </div>
    </Form>
  );
};
