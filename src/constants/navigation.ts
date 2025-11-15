import { Home, Search, User, ChatBubble, Community } from "iconoir-react";

export const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Search", href: "/search", icon: Search },
  { name: "Friends", href: "/friends", icon: Community },
  { name: "Messages", href: "/messages", icon: ChatBubble },
  { name: "Profile", href: "/profile", icon: User },
] as const;
