import RegisterPage from "@/components/register";
import { PublicRoute } from "@/components/auth/ProtectedRoute";

export default function Register() {
  return (
    <PublicRoute redirectTo="/">
      <RegisterPage />
    </PublicRoute>
  );
}
