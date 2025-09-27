import type React from "react";
import type { SVGProps } from "react";

type Props = {
  title?: string;
  onClick?(): void;
  size?: "sm" | "lg";
  Icon?: React.ComponentType<SVGProps<SVGSVGElement>>;
};

const Button = ({ title, onClick, size = "sm", Icon }: Props) => {
  return (
    <button id="button" className={`${size}`} onClick={onClick}>
      {Icon && <Icon />}
      {title}
    </button>
  );
};

export default Button;
