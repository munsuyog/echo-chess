import type { ISVGIcon } from "../types/icon.type";


const SwordIcon = (props: ISVGIcon) => {
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
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M17.0468 0.427734H22.5708V5.95169L11.0104 17.5132L5.48643 11.9882L17.0468 0.427734ZM1.61976 13.2777L4.19788 15.8559L0.0416355 20.0121V22.9579H2.98955L7.1458 18.8017L9.72288 21.3798L11.1958 19.9069L3.09372 11.8048L1.61976 13.2777Z"
        fill="#A9F99E"
      />
    </svg>
  );
};

export default SwordIcon;
