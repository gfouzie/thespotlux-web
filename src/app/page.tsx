"use client";

import { ProtectedRoute, PublicRoute } from "@/components/auth/ProtectedRoute";
import LandingPage from "@/components/landing";
import Dashboard from "@/components/dashboard";

export default function Home() {
  return (
    <>
      <PublicRoute>
        <LandingPage />
      </PublicRoute>
      <ProtectedRoute redirectTo="/login">
        <Dashboard />
      </ProtectedRoute>
    </>
  );
}
