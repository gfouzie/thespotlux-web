"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/api";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input/index";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      // Redirect will happen automatically via AuthContext
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-full max-w-md relative">
        <div className="flex justify-center mb-8">
          <Image
            src="/thespotlux_logo.png"
            alt="Spotlux Logo"
            width={600}
            height={150}
            className="object-contain"
            priority
          />
        </div>
        <h3 className="text-2xl mb-2 text-center">SHINING ON THE FUTURE</h3>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-8 w-[640px] h-8 bg-text-col/70 z-10 spotlight-oval" />
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-card-col px-4 py-6 rounded-md relative z-20"
        >
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <div>
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              showPasswordToggle
              required
              minLength={8}
            />
            <div className="text-right mt-2">
              <button
                type="button"
                onClick={() => console.log("Forgot password clicked")}
                className="text-sm text-text-col hover:text-text-col/80 transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            loadingText="Signing in..."
            className="w-full"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-text-col/70">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-accent-col hover:text-accent-col/80 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
