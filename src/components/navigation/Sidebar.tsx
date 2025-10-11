"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Home,
  Search,
  User,
  ChatBubble,
  Settings,
  LogOut,
  ArrowLeft,
  ArrowRight,
} from "iconoir-react";
import Icon from "@/components/common/Icon";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className = "" }: SidebarProps) => {
  const { state, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();

  // Get collapsed state directly from localStorage (no state variable)
  const getIsCollapsed = () => {
    if (typeof window === "undefined") return false;
    const savedState = localStorage.getItem("spotlux-sidebar-collapsed");
    return savedState !== null ? JSON.parse(savedState) : false;
  };

  const isCollapsed = getIsCollapsed();

  // Use a simple counter to force re-renders when localStorage changes
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [refreshKey, setRefreshKey] = useState(0);

  // Save sidebar state to localStorage when it changes
  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    localStorage.setItem("spotlux-sidebar-collapsed", JSON.stringify(newState));
    // Force re-render by updating refresh key
    setRefreshKey((prev) => prev + 1);
  };

  const logoSrc =
    theme === "light"
      ? "/thespotlux_logo_light.png"
      : "/thespotlux_logo_dark.png";

  const iconSrc =
    theme === "light"
      ? "/thespotlux_icon_light.png"
      : "/thespotlux_icon_dark.png";

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Search", href: "/search", icon: Search },
    { name: "Messages", href: "/messages", icon: ChatBubble },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  if (!state.isAuthenticated) {
    return null;
  }

  return (
    <div
      className={`bg-bg-col/80 backdrop-blur-sm border-r border-text-col/20 h-full flex flex-col transition-all duration-300 relative ${
        isCollapsed ? "w-24" : "w-64"
      } ${className}`}
    >
      {/* Floating Toggle Button */}
      <button
        onClick={handleToggleCollapse}
        className="absolute -right-3 top-19 z-10 w-6 h-6 bg-bg-col border border-text-col/20 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:bg-accent-col hover:text-white cursor-pointer"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <span className="text-text-col text-sm font-bold">
          <Icon
            icon={isCollapsed ? ArrowRight : ArrowLeft}
            width={14}
            height={14}
          />
        </span>
      </button>

      {/* Logo/Brand */}
      <div className="p-6 border-b border-text-col/20 flex items-center justify-center">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image
            src={isCollapsed ? iconSrc : logoSrc}
            alt="Spotlux"
            width={isCollapsed ? 48 : 180}
            height={isCollapsed ? 48 : 45}
            className="object-contain"
            priority
          />
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors group ${
              isActive(item.href)
                ? "border-l-4 border-accent-col bg-bg-col/30"
                : "text-text-col hover:bg-bg-col/50 hover:border-l-4 hover:border-accent-col/50"
            } ${!isCollapsed ? "space-x-3" : "justify-center"}`}
            title={isCollapsed ? item.name : undefined}
          >
            <Icon icon={item.icon} width={24} height={24} />
            {!isCollapsed && <span className="font-medium">{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-text-col/20 space-y-2">
        <Link
          href="/settings"
          className={`flex items-center px-4 py-3 rounded-lg transition-colors group ${
            isActive("/settings")
              ? "border-l-4 border-accent-col bg-bg-col/30"
              : "text-text-col hover:bg-bg-col/50 hover:border-l-4 hover:border-accent-col/50"
          } ${!isCollapsed ? "space-x-3" : "justify-center"}`}
          title={isCollapsed ? "Settings" : undefined}
        >
          <Icon icon={Settings} width={24} height={24} />
          {!isCollapsed && <span className="font-medium">Settings</span>}
        </Link>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors group cursor-pointer ${
            !isCollapsed ? "space-x-3" : "justify-center"
          } text-text-col hover:bg-bg-col/50 hover:border-l-4 hover:border-red-500/50`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <Icon icon={LogOut} width={24} height={24} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
