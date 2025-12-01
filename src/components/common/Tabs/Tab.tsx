"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  icon?: React.ReactNode;
}

const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ isActive = false, icon, children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center px-4 py-3 text-sm font-medium transition-colors duration-200",
          "border-b-2 focus:outline-none focus:ring-2 focus:ring-accent-col/50",
          isActive
            ? "border-accent-col text-text-col"
            : "border-transparent text-text-col/60 hover:text-text-col hover:border-text-col/30",
          className
        )}
        {...props}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  }
);

Tab.displayName = "Tab";

export default Tab;
