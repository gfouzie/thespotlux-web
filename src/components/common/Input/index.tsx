"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "./icons";
import "./input.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      showPasswordToggle = false,
      icon,
      className,
      type = "text",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = showPasswordToggle
      ? showPassword
        ? "text"
        : "password"
      : type;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium mb-2 text-text-col"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-col/60">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            autoComplete="off"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              // Base styles
              "spotlux-input", // ← Component-specific class for autofill styles
              "w-full px-4 py-3 rounded-lg transition-all duration-200",
              "bg-bg-col border border-text-col/30",
              "text-text-col placeholder-text-col/50",
              "focus:outline-none focus:ring-2 focus:ring-accent-col focus:border-transparent",

              // Icon padding
              icon && "pl-10",

              // Password toggle padding
              showPasswordToggle && "pr-12",

              // Error state
              error && "border-red-500 focus:ring-red-500",

              // Focus state
              isFocused && "bg-text-col/15",

              className
            )}
            {...props}
          />

          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-col/60 hover:text-text-col transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          )}
        </div>

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
