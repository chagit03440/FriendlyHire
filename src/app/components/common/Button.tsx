import React from "react";
import { cx } from "@/app/lib/cx";
import { Tooltip } from "./Tooltip";

type ReactButtonProps = React.ComponentProps<"button">;
type ReactAnchorProps = React.ComponentProps<"a">;
type ButtonProps = ReactButtonProps | ReactAnchorProps;

const isAnchor = (props: ButtonProps): props is ReactAnchorProps => {
  return "href" in props;
};

interface ButtonLinkProps {
  onClick: () => void;
  text: string;
}

const ButtonLink: React.FC<ButtonLinkProps> = ({ onClick, text }) => {
  return (
    <button
    onClick={onClick} 
    className="px-4 py-2 text-white bg-gray-700 hover:bg-gray-800 rounded-md transition-colors duration-300 ease-in-out"
  >
    {text}
  </button>
  );
};

export default ButtonLink;

export const Button = (props: ButtonProps) => {
  if (isAnchor(props)) {
    return <a {...props} />;
  } else {
    return <button type="button" {...props} />;
  }
};

export const PrimaryButton = ({ className, ...props }: ButtonProps) => (
  <Button className={cx("btn-primary", className)} {...props} />
);

type IconButtonProps = ButtonProps & {
  size?: "small" | "medium";
  tooltipText: string;
};

export const IconButton = ({
  className,
  size = "medium",
  tooltipText,
  ...props
}: IconButtonProps) => (
  <Tooltip text={tooltipText}>
    <Button
      type="button"
      className={cx(
        "rounded-full outline-none hover:bg-gray-100 focus-visible:bg-gray-100",
        size === "medium" ? "p-1.5" : "p-1",
        className
      )}
      {...props}
    />
  </Tooltip>
);
