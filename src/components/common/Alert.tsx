"use client";

import { cn } from "@/lib/utils";

interface AlertProps {
  variant?: "error" | "success" | "warning" | "info";
  children: React.ReactNode;
  className?: string;
}

const Alert = ({ variant = "info", children, className }: AlertProps) => {
  const variantStyles = {
    error: "bg-red-500/10 border-red-500 text-red-500",
    success: "bg-green-500/10 border-green-500 text-green-500",
    warning: "bg-yellow-500/10 border-yellow-500 text-yellow-500",
    info: "bg-blue-500/10 border-blue-500 text-blue-500",
  };

  return (
    <div
      className={cn(
        "p-4 rounded border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Alert;
