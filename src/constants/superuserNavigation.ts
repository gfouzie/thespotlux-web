import { ChatLines, Tools, Settings, FolderSettings } from "iconoir-react";

export const superuserNavigationItems = [
  { 
    name: "Internal Tools", 
    href: "/internal-tools", 
    icon: Settings,
    children: [
      { name: "Prompts", href: "/internal-tools/prompts", icon: ChatLines },
      { name: "Prompt Categories", href: "/internal-tools/prompt-categories", icon: FolderSettings },
      { name: "Team Creation", href: "/internal-tools/team-creation", icon: Tools },
    ]
  },
] as const;
