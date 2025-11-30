"use client";

import { useEffect, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Xmark } from "iconoir-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      size = "md",
      showCloseButton = true,
      closeOnOverlayClick = true,
      className,
    },
    ref
  ) => {
    // Handle escape key
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
        // Prevent body scroll when modal is open
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }, [isOpen, onClose]);

    if (!isOpen) {
      return null;
    }

    const sizeStyles = {
      sm: "max-w-md",
      md: "max-w-lg",
      lg: "max-w-2xl",
      xl: "max-w-4xl",
      full: "max-w-full mx-4",
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={closeOnOverlayClick ? onClose : undefined}
          aria-hidden="true"
        />

        {/* Modal Content */}
        <div
          ref={ref}
          className={cn(
            "relative w-full bg-card-col rounded-lg shadow-xl",
            "transform transition-all duration-200",
            "max-h-[90vh] overflow-hidden flex flex-col",
            sizeStyles[size],
            className
          )}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-bg-col/50">
              {title && (
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-text-col"
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="ml-auto p-2 rounded-lg text-text-col/60 hover:text-text-col hover:bg-bg-col/50 transition-colors"
                  aria-label="Close modal"
                >
                  <Xmark className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        </div>
      </div>
    );
  }
);

Modal.displayName = "Modal";

export default Modal;
