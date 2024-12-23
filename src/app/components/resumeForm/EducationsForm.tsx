import { Form, FormSection } from "./form/Form";
import {
  BulletListTextarea,
  Input,
} from "./form/InputGroup";
import { BulletListIconButton } from "./form/IconButton";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import { changeEducations, selectEducations } from "@/app/lib/redux/resumeSlice";
import type { ResumeEducation } from "@/app/lib/redux/types";
import {
  changeShowBulletPoints,
  selectShowBulletPoints,
} from "@/app/lib/redux/settingsSlice";

export const EducationsForm = () => {
  const educations = useAppSelector(selectEducations);
  const dispatch = useAppDispatch();
  const showDelete = educations.length > 1;
  const form = "educations";
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));

  return (
    <Form form={form} addButtonText="Add School">
      {educations.map(({ school, degree, gpa, date, descriptions }, idx) => {
        const handleEducationChange = <
        T extends keyof ResumeEducation,
        V extends T extends "descriptions" ? string[] : string
      >(
        field: T,
        value: V
       ) => {
        if (field === "descriptions" && Array.isArray(value)) {
          dispatch(
            changeEducations({
              idx,
              field,
              value,
            } as {
              idx: number;
              field: "descriptions";
              value: string[];
            })
          );
        } else if (field !== "descriptions" && typeof value === "string") {
          dispatch(
            changeEducations({
              idx,
              field,
              value,
            } as {
              idx: number;
              field: Exclude<keyof ResumeEducation, "descriptions">;
              value: string;
            })
          );
        }        };

        const handleShowBulletPoints = (value: boolean) => {
          dispatch(changeShowBulletPoints({ field: form, value }));
        };

        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== educations.length - 1;

        return (
          <FormSection
            key={idx}
            form="educations"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText="Delete school"
          >
            <Input
              label="School"
              labelClassName="col-span-4"
              name="school"
              placeholder="Cornell University"
              value={school}
              onChange={handleEducationChange}
            />
            <Input
              label="Date"
              labelClassName="col-span-2"
              name="date"
              placeholder="May 2018"
              value={date}
              onChange={handleEducationChange}
            />
            <Input
              label="Degree & Major"
              labelClassName="col-span-4"
              name="degree"
              placeholder="Bachelor of Science in Computer Engineering"
              value={degree}
              onChange={handleEducationChange}
            />
            <Input
              label="GPA"
              labelClassName="col-span-2"
              name="gpa"
              placeholder="3.81"
              value={gpa}
              onChange={handleEducationChange}
            />
            <div className="relative col-span-full">
              <BulletListTextarea
                label="Additional Information (Optional)"
                labelClassName="col-span-full"
                name="descriptions"
                placeholder="Free paragraph space to list out additional activities, courses, awards etc"
                value={descriptions}
                onChange={handleEducationChange}
                showBulletPoints={showBulletPoints}
              />
              <div className="absolute left-[15.6rem] top-[0.07rem]">
                <BulletListIconButton
                  showBulletPoints={showBulletPoints}
                  onClick={handleShowBulletPoints}
                />
              </div>
            </div>
          </FormSection>
        );
      })}
    </Form>
  );
};
