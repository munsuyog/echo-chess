import type React from "react";
import type { ISVGIcon } from "../../types/icon.type";
import { useNavigate } from "react-router";

type Props = {
  url?: string;
  title?: string;
  Icon?: React.ComponentType<ISVGIcon>;
  active?: boolean;
};

const SidebarButton = ({ url, title, Icon, active }: Props) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (!url) return;
    navigate(url);
  };
  return (
    <div
      className={`${active && "active"} sidebar-button`}
      onClick={handleClick}
    >
      {Icon && <Icon active={active} />}
      <p>{title}</p>
    </div>
  );
};

export default SidebarButton;
