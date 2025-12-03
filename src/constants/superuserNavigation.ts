import { ChatLines, Tools, Settings } from "iconoir-react";

export const superuserNavigationItems = [
  { 
    name: "Internal Tools", 
    href: "/internal-tools", 
    icon: Settings,
    children: [
      { name: "Prompts", href: "/internal-tools/prompts", icon: ChatLines },
      { name: "Team Creation", href: "/internal-tools/team-creation", icon: Tools },
    ]
  },
] as const;
