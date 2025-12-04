"use client";

import { Xmark } from "iconoir-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
}: EditProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card-col rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-component-col">
          <h2 className="text-xl font-semibold text-text-col">Edit Profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-text-col opacity-70 hover:opacity-100 transition-opacity"
          >
            <Xmark className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="text-center text-text-col opacity-70 py-8">
            Edit functionality coming soon...
          </div>
        </div>
      </div>
    </div>
  );
}
