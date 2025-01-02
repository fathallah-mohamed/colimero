import { LoginForm } from "../LoginForm";
import { useNavigate } from "react-router-dom";

export function AdminLoginForm() {
  const navigate = useNavigate();

  return (
    <LoginForm
      onForgotPassword={() => {}}
      onRegister={() => {}}
      onCarrierRegister={() => {}}
      onSuccess={() => navigate("/admin")}
      requiredUserType="admin"
    />
  );
}