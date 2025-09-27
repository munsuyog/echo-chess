import { useLocation } from "react-router";
import LogoIcon from "../../icons/logo";
import FriendsIcon from "../../icons/sidebar/friends";
import PlayIcon from "../../icons/sidebar/play";
import ResultsIcon from "../../icons/sidebar/results";
import type { ISidebarButton } from "../../types/sidebar.type";
import SidebarButton from "./sidebarButton";

const Sidebar = () => {
  const location = useLocation();
  const links: ISidebarButton[] = [
    { url: "/play", title: "Play", Icon: PlayIcon },
    { url: "/friends", title: "Friends", Icon: FriendsIcon },
    { url: "/results", title: "Results", Icon: ResultsIcon },
  ];
  return (
    <div id="sidebar">
      <div className="logo-wrapper">
        <LogoIcon />
        <h6>ChessLing</h6>
      </div>
      <div className="links-wrapper">
        {links.map((link) => (
          <SidebarButton
            url={link.url}
            Icon={link.Icon}
            title={link.title}
            active={location.pathname == link.url}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
