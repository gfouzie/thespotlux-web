import { Home, Search, User, ChatBubble, Community, Tools } from "iconoir-react";

export const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Search", href: "/search", icon: Search },
  { name: "Messages", href: "/messages", icon: ChatBubble },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Test Tools", href: "/test-tools", icon: Tools },
] as const;
