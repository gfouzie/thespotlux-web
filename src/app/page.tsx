"use client";

import LandingPage from "@/components/landing";
import Dashboard from "@/components/dashboard";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { state } = useAuth();

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-col text-text-col">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent-col border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return state.isAuthenticated ? <Dashboard /> : <LandingPage />;
}
