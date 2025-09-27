import type { ISVGIcon } from "./icon.type";

export interface ISidebarButton {
  url?: string;
  title?: string;
  Icon?: React.ComponentType<ISVGIcon>;
  active?: boolean;
}
