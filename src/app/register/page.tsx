"use client";

import RegisterPage from "@/components/register";
import { PublicRoute } from "@/components/auth/ProtectedRoute";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function Register() {
  return (
    <ThemeProvider defaultTheme="dark">
      <PublicRoute redirectTo="/">
        <RegisterPage />
      </PublicRoute>
    </ThemeProvider>
  );
}
