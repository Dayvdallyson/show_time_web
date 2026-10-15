import { useActionState } from "react";
import { useNavigate } from "react-router";

import { LoginForm, type LoginFormState } from "@/components/login-form";
import { login, LoginError } from "@/lib/auth";

const initialState: LoginFormState = { error: null, email: "" };

export function LoginPage() {
  const navigate = useNavigate();

  const [state, formAction, isPending] = useActionState(
    async (_prev: LoginFormState, formData: FormData): Promise<LoginFormState> => {
      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");

      try {
        await login({ email, password });
      } catch (error) {
        const message = error instanceof LoginError ? error.message : "Erro inesperado. Tente novamente.";
        return { error: message, email };
      }

      navigate("/");
      return initialState;
    },
    initialState,
  );

  return (
    <main className="flex min-h-svh items-center justify-center bg-neutral-200 p-4">
      <LoginForm
        action={formAction}
        state={state}
        isPending={isPending}
        onSignUp={() => console.log("sign up")}
        onForgotPassword={() => console.log("forgot password")}
      />
    </main>
  );
}
