"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    // Base styles
    const baseStyles = cn(
      "inline-flex cursor-pointer items-center justify-center rounded-lg font-medium transition-colors duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-col",
      "disabled:cursor-not-allowed disabled:opacity-50"
    );

    // Size variants
    const sizeStyles = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-6 py-4 text-lg",
    };

    // Variant styles
    const variantStyles = {
      primary: cn(
        "bg-primary-col text-bg-col",
        "hover:bg-primary-col/90 focus:ring-primary-col",
        "disabled:bg-primary-col/50"
      ),
      secondary: cn(
        "bg-text-col/10 text-text-col border border-text-col/30",
        "hover:bg-text-col/20 focus:ring-text-col/50",
        "disabled:bg-text-col/5 disabled:border-text-col/20"
      ),
      danger: cn(
        "bg-red-600 text-white",
        "hover:bg-red-700 focus:ring-red-500",
        "disabled:bg-red-600/50"
      ),
      success: cn(
        "bg-green-600 text-white",
        "hover:bg-green-700 focus:ring-green-500",
        "disabled:bg-green-600/50"
      ),
    };

    const spinnerVariantStyles = {
      primary: "border-bg-col/30 border-t-bg-col",
      secondary: "border-text-col/30 border-t-text-col",
      danger: "border-white/30 border-t-white",
      success: "border-white/30 border-t-white",
    };

    const spinnerSizeStyles = {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {/* Left Icon */}
        {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}

        {/* Loading Spinner */}
        {isLoading && (
          <div
            className={cn(
              "animate-spin rounded-full border-2 mr-2",
              spinnerVariantStyles[variant],
              spinnerSizeStyles[size]
            )}
          />
        )}

        {/* Button Content */}
        {isLoading ? loadingText || "Loading..." : children}

        {/* Right Icon */}
        {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
