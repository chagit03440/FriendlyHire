import { Form, FormSection } from "./form/Form";
import {
  Input,
  BulletListTextarea,
} from "./form/InputGroup";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import { selectProjects, changeProjects } from "@/app/lib/redux/resumeSlice";
import type { ResumeProject } from "@/app/lib/redux/types";

export const ProjectsForm = () => {
  const projects = useAppSelector(selectProjects);
  const dispatch = useAppDispatch();
  const showDelete = projects.length > 1;

  return (
    <Form form="projects" addButtonText="Add Project">
      {projects.map(({ project, date, descriptions }, idx) => {
        const handleProjectChange = <
          T extends keyof ResumeProject,
          V extends T extends "descriptions" ? string[] : string
        >(
          field: T,
          value: V
        ) => {
          if (field === "descriptions" && Array.isArray(value)) {
            dispatch(
              changeProjects({
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
              changeProjects({
                idx,
                field,
                value,
              } as {
                idx: number;
                field: Exclude<keyof ResumeProject, "descriptions">;
                value: string;
              })
            );
          }        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== projects.length - 1;

        return (
          <FormSection
            key={idx}
            form="projects"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText={"Delete project"}
          >
            <Input
              name="project"
              label="Project Name"
              placeholder="OpenResume"
              value={project}
              onChange={handleProjectChange}
              labelClassName="col-span-4"
            />
            <Input
              name="date"
              label="Date"
              placeholder="Winter 2022"
              value={date}
              onChange={handleProjectChange}
              labelClassName="col-span-2"
            />
            <BulletListTextarea
              name="descriptions"
              label="Description"
              placeholder="Bullet points"
              value={descriptions}
              onChange={handleProjectChange}
              labelClassName="col-span-full"
            />
          </FormSection>
        );
      })}
    </Form>
  );
};
