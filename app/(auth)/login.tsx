import { loginService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { router } from "expo-router";
import React, { useState } from "react";

// 👉 UI components (punya kamu)
import LoginView from "@/views/LoginView";

export default function LoginScreen() {
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState("");

  const onLogin = async (email: string, password: string) => {
    setError("");
    try {
      const user = await loginService({ email, password });
      setUser(user);
      router.replace("/(tabs)");
    } catch (err: any) {
      setError("Email atau password salah");
    }
  };

  return <LoginView onLogin={onLogin} error={error} />;
}
