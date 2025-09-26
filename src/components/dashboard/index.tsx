"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import { Button } from "@/components/common/Button";

export default function Dashboard() {
  const { logout, state } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Spotlux!</h1>
          <p className="text-text-col/70 text-lg mb-8">
            You're successfully logged in. This is your private dashboard.
          </p>
        </div>

        <div className="bg-text-col/10 border border-text-col/30 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Coming Soon</h2>
          <p className="text-text-col/70">
            Your personalized dashboard with athlete profiles, scout
            connections, and more exciting features are on the way!
          </p>
        </div>

        <div className="pt-8 space-y-4">
          <Button
            onClick={toggleTheme}
            variant="secondary"
            size="md"
            className="w-full"
          >
            Switch to {theme === "light" ? "Dark" : "Light"} Mode
          </Button>

          <Button
            onClick={handleLogout}
            variant="danger"
            size="md"
            isLoading={isLoggingOut}
            loadingText="Logging out..."
            className="w-full"
          >
            Log Out
          </Button>
        </div>

        {state.error && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            {state.error}
          </div>
        )}
      </div>
    </div>
  );
}
