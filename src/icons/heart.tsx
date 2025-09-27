import { type SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
  active?: boolean;
}

const HeartIcon = ({ active = true, ...props }: Props) => {
  return (
    <svg
      width="40"
      height="36"
      viewBox="0 0 40 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M30 2C23.6 2 20 7.334 20 10C20 7.334 16.4 2 10 2C3.6 2 2 7.334 2 10C2 24 20 34 20 34C20 34 38 24 38 10C38 7.334 36.4 2 30 2Z"
        fill={active ? "#FF4C4C" : "#3C3C3C"}
        stroke={active ? "#FF4C4C" : "#3C3C3C"}
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default HeartIcon;
