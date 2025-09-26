"use client";

import RegisterPage from "@/components/register";
import { PublicRoute } from "@/components/auth/ProtectedRoute";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect } from "react";

export default function Register() {
  const { setTheme } = useTheme();

  // Set dark theme for register page
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  return (
    <PublicRoute redirectTo="/">
      <RegisterPage />
    </PublicRoute>
  );
}
