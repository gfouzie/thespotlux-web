"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/navigation/Sidebar";
import LoadingState from "@/components/common/LoadingState";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push("/login");
    }
  }, [authState.isAuthenticated, router]);

  if (!authState.isAuthenticated) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-bg-col flex">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Sidebar />
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
};

export default AuthenticatedLayout;
