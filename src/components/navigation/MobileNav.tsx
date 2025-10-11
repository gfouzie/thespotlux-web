"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import { Settings, LogOut } from "iconoir-react";
import Icon from "@/components/common/Icon";
import { navigationItems } from "@/constants/navigation";

interface MobileNavProps {
  className?: string;
}

const MobileNav = ({ className = "" }: MobileNavProps) => {
  const { authState, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();

  const logoSrc =
    theme === "light"
      ? "/thespotlux_logo_light.png"
      : "/thespotlux_logo_dark.png";

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  if (!authState.isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Top Header */}
      <div
        className={`bg-bg-col/80 backdrop-blur-sm border-b border-text-col/20 ${className}`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src={logoSrc}
              alt="Spotlux"
              width={120}
              height={30}
              className="object-contain"
              priority
            />
          </Link>

          {/* Settings and Logout */}
          <div className="flex items-center space-x-2">
            <Link
              href="/settings"
              className={`p-2 rounded-lg transition-colors ${
                isActive("/settings")
                  ? "bg-accent-col/20 text-accent-col"
                  : "text-text-col hover:bg-bg-col/50"
              }`}
              title="Settings"
            >
              <Icon icon={Settings} width={20} height={20} />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-text-col hover:bg-red-500/20 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <Icon icon={LogOut} width={20} height={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg-col/80 backdrop-blur-sm border-t border-text-col/20 lg:hidden z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors relative ${
                isActive(item.href)
                  ? "text-text-col"
                  : "text-text-col hover:text-accent-col/70"
              }`}
            >
              {isActive(item.href) && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-accent-col rounded-t-full" />
              )}
              <Icon icon={item.icon} width={24} height={24} />
              <span className="text-xs font-medium mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileNav;
