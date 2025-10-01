import type React from "react";
import type { SVGProps } from "react";

type Props = {
  title?: string;
  onClick?(): void;
  size?: "sm" | "lg" | "md";
  Icon?: React.ComponentType<SVGProps<SVGSVGElement>>;
  disabled?: boolean;
  type?: "primary" | "secondary";
  className?: string;
};

const Button = ({
  title,
  onClick,
  size,
  Icon,
  disabled = false,
  type = "primary",
  className,
}: Props) => {
  return (
    <button
      id="button"
      className={`${size} ${disabled ? "disabled" : ""} ${type} ${className}`}
      onClick={onClick}
    >
      <div className="btn-container">
        {Icon && <Icon />}
        {title && <span>{title}</span>}
      </div>
      <div className="border"></div>
    </button>
  );
};

export default Button;
