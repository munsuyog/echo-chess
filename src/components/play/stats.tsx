import type React from "react";
import type { ISVGIcon } from "../../types/icon.type";

type Props = {
  title: string;
  Icon: React.ComponentType<ISVGIcon>;
  value: string;
};

const Stats = ({ title, Icon, value }: Props) => {
  return (
    <div className="stats">
      <div className="title">{title}</div>
      <div className="stats-wrapper">
        <div className="icon-wrapper">
          <Icon />
        </div>
        <span>{value}</span>
      </div>
    </div>
  );
};

export default Stats;
