"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/navigation/Sidebar";
import MobileNav from "@/components/navigation/MobileNav";
import LoadingState from "@/components/common/LoadingState";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push("/login");
    }
  }, [authState.isLoading, authState.isAuthenticated, router]);

  if (authState.isLoading || !authState.isAuthenticated) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-bg-col flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNav />
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-auto lg:pt-0 pt-0 pb-20 lg:pb-0">
        {children}
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
