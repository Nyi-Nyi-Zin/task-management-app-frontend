import { AuthForm } from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";

export function AuthPage() {
  const navigate = useNavigate();

  return (
    <AuthForm
      onSuccess={() => {
        navigate("/");
      }}
    />
  );
}
