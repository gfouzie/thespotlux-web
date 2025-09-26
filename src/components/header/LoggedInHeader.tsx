"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/common/Button";
import { useState } from "react";

export default function LoggedInHeader() {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="flex justify-between items-center p-6 lg:px-12 bg-bg-col text-text-col">
      <Link href="/" className="hover:opacity-80 transition-opacity">
        <Image
          src="/thespotlux_logo.png"
          alt="Spotlux Logo"
          width={180}
          height={45}
          className="object-contain"
          priority
        />
      </Link>

      <div className="flex items-center gap-4">
        <Button
          onClick={handleLogout}
          variant="danger"
          size="sm"
          isLoading={isLoggingOut}
          loadingText="Logging out..."
        >
          Log Out
        </Button>
      </div>
    </header>
  );
}
