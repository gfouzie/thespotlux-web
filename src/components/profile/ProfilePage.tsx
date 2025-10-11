"use client";

import React, { useState } from "react";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import AboutSection from "@/components/profile/AboutSection";

const ProfilePage: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(true); // Default to edit mode for owner

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-bg-col py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-text-col">My Profile</h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  isEditMode
                    ? "bg-component-col text-text-col hover:opacity-80"
                    : "bg-accent-col text-text-col hover:opacity-80"
                }`}
              >
                <span>{isEditMode ? "Preview" : "Edit"}</span>
              </button>
            </div>
          </div>

          {/* Profile Sections */}
          <div className="space-y-8">
            <AboutSection isEditMode={isEditMode} />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ProfilePage;
