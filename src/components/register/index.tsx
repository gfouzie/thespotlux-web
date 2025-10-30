"use client";

import { useReducer } from "react";
import { useRouter } from "next/navigation";
import { userApi, ApiError } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import Input from "@/components/common/Input/index";
import Button from "@/components/common/Button";
import AuthFormContainer from "@/components/auth/AuthFormContainer";

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface State {
  formData: FormData;
  loading: boolean;
  error: string;
  hasAttemptedSubmit: boolean;
}

type Action =
  | { type: "UPDATE_FIELD"; field: keyof FormData; value: string }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string }
  | { type: "RESET_FORM" }
  | { type: "SET_ATTEMPTED_SUBMIT"; attempted: boolean };

// Initial state
const initialState: State = {
  formData: {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  loading: false,
  error: "",
  hasAttemptedSubmit: false,
};

// Reducer function
const registrationReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value,
        },
        error: "", // Clear error when user starts typing
        hasAttemptedSubmit: false, // Reset submit attempt when user types
      };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "SET_ERROR":
      return { ...state, error: action.error, loading: false };
    case "RESET_FORM":
      return initialState;
    case "SET_ATTEMPTED_SUBMIT":
      return { ...state, hasAttemptedSubmit: action.attempted };
    default:
      return state;
  }
};

export default function RegisterPage() {
  const router = useRouter();
  const { setAccessToken } = useAuth();
  const [state, dispatch] = useReducer(registrationReducer, initialState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_ATTEMPTED_SUBMIT", attempted: true });
    dispatch({ type: "SET_LOADING", loading: true });

    try {
      // Validate first/last name contain only letters
      const namePattern = /^[A-Za-z]{2,30}$/;
      if (
        !namePattern.test(state.formData.first_name) ||
        !namePattern.test(state.formData.last_name)
      ) {
        dispatch({
          type: "SET_ERROR",
          error: "First and last name must be letters only (2-30).",
        });
        return;
      }

      // Check if passwords match
      if (state.formData.password !== state.formData.confirmPassword) {
        dispatch({ type: "SET_ERROR", error: "Passwords do not match" });
        return;
      }

      // Remove confirmPassword from the data sent to API
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword: _, ...registrationData } = state.formData;

      // Generate username from email (can be changed during onboarding)
      const username = state.formData.email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

      // Register and auto-login the user
      const loginResponse = await userApi.registerAndLogin({
        ...registrationData,
        username,
      });
      console.log("User registered and logged in successfully");

      // Set the access token in auth context
      setAccessToken(loginResponse.access_token);

      // Redirect to dashboard
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError) {
        dispatch({ type: "SET_ERROR", error: err.message });
      } else {
        dispatch({
          type: "SET_ERROR",
          error: err instanceof Error ? err.message : "Registration failed",
        });
      }
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  return (
    <AuthFormContainer
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkHref="/login"
    >
      {state.error && (
        <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
          {state.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="first_name"
            type="text"
            label="First Name"
            placeholder="First name"
            value={state.formData.first_name}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_FIELD",
                field: "first_name",
                value: e.target.value,
              })
            }
            required
            minLength={2}
            maxLength={30}
          />
          <Input
            id="last_name"
            type="text"
            label="Last Name"
            placeholder="Last name"
            value={state.formData.last_name}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_FIELD",
                field: "last_name",
                value: e.target.value,
              })
            }
            required
            minLength={2}
            maxLength={30}
          />
        </div>
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="your@email.com"
          value={state.formData.email}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_FIELD",
              field: "email",
              value: e.target.value,
            })
          }
          required
        />

        <div>
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Create a secure password"
            value={state.formData.password}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_FIELD",
                field: "password",
                value: e.target.value,
              })
            }
            showPasswordToggle
            required
            minLength={8}
          />
          <p className="text-text-col/60 text-xs mt-1">
            Minimum 8 characters with complexity requirements
          </p>
        </div>

        <Input
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={state.formData.confirmPassword}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_FIELD",
              field: "confirmPassword",
              value: e.target.value,
            })
          }
          showPasswordToggle
          required
          minLength={8}
          error={
            state.hasAttemptedSubmit &&
            state.formData.confirmPassword &&
            state.formData.password !== state.formData.confirmPassword
              ? "Passwords do not match"
              : undefined
          }
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={state.loading}
          loadingText="Creating Account..."
          className="w-full"
        >
          Create Account
        </Button>
      </form>
    </AuthFormContainer>
  );
}
