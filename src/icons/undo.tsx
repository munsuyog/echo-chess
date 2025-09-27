import { type SVGProps } from "react";


const UndoIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.98193 15.5355C4.98193 12.2616 6.82226 9.44308 9.46724 8.17598C10.447 7.70542 11.5201 7.46137 12.607 7.46191C16.8182 7.46191 20.232 11.0766 20.232 15.5355"
        stroke="white"
        stroke-width="1.60445"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.57021 13.2929L4.98196 15.5355L2.29077 11.9473"
        stroke="white"
        stroke-width="1.60445"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default UndoIcon;
