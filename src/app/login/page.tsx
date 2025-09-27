import LoginPage from "@/components/login";
import { PublicRoute } from "@/components/auth/ProtectedRoute";

export default function Login() {
  return (
    <PublicRoute redirectTo="/">
      <LoginPage />
    </PublicRoute>
  );
}
