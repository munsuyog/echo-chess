import  { type SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
  active?: boolean;
}

const ResultsIcon = ({ active, ...props }: Props) => {
  return (
    <svg
      width="20"
      height="16"
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clip-path="url(#clip0_1348_941)">
        <path
          d="M13.7736 5.48307H19.3127C19.2672 5.29477 19.1744 5.12118 19.0431 4.97872L15.2083 0.952637L13.7736 5.48307Z"
          fill={active? "#A9F99E" : "#D4D3D3"}
        />
        <path
          d="M7.19156 5.48311H12.8611L14.4785 0.361371C14.3371 0.305914 14.1869 0.276455 14.035 0.274414H5.86112H5.62634L7.19156 5.48311Z"
          fill={active? "#A9F99E" : "#D4D3D3"}

        />
        <path
          d="M7.45203 6.35229L9.95637 14.6393L12.5825 6.35229H7.45203Z"
          fill={active? "#A9F99E" : "#D4D3D3"}

        />
        <path
          d="M13.4959 6.35229L10.4351 15.9697C10.6015 15.903 10.7503 15.7989 10.8698 15.6653L19.0611 6.66534C19.1392 6.57046 19.2036 6.46508 19.2524 6.35229H13.4959Z"
          fill={active? "#A9F99E" : "#D4D3D3"}

        />
        <path
          d="M6.28733 5.48184L4.86124 0.768799L0.869936 4.97749C0.736131 5.11945 0.640408 5.29295 0.591675 5.48184H6.28733Z"
          fill={active? "#A9F99E" : "#D4D3D3"}

        />
        <path
          d="M6.54775 6.35229H0.6521C0.708513 6.46692 0.781791 6.57244 0.869491 6.66534L9.06949 15.7001C9.18856 15.8364 9.33731 15.9434 9.50427 16.0132L6.54775 6.35229Z"
          fill={active? "#A9F99E" : "#D4D3D3"}

        />
      </g>
      <defs>
        <clipPath id="clip0_1348_941">
          <rect
            width="20"
            height="15.6522"
            fill="white"
            transform="translate(0 0.31665)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ResultsIcon;
