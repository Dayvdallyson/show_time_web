import { useActionState, useState } from "react";
import { useNavigate } from "react-router";

import { LoginForm, type LoginFormState } from "@/components/login-form";
import { authenticate, type AuthMode } from "@/lib/auth";

export function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");

  return (
    <main className="flex min-h-svh items-center justify-center bg-neutral-200 p-4">
      <AuthPanel
        key={mode}
        mode={mode}
        initialEmail={email}
        onSwitchMode={currentEmail => {
          setEmail(currentEmail);
          setMode(current => (current === "login" ? "register" : "login"));
        }}
      />
    </main>
  );
}

function AuthPanel({
  mode,
  initialEmail,
  onSwitchMode,
}: {
  mode: AuthMode;
  initialEmail: string;
  onSwitchMode: (email: string) => void;
}) {
  const navigate = useNavigate();
  const initialState: LoginFormState = { fieldErrors: {}, formError: null, email: initialEmail, emailConfirmation: "" };

  const [state, formAction, isPending] = useActionState(
    async (_prev: LoginFormState, formData: FormData): Promise<LoginFormState> => {
      const input = {
        email: String(formData.get("email") ?? ""),
        emailConfirmation: String(formData.get("emailConfirmation") ?? ""),
        password: String(formData.get("password") ?? ""),
      };

      const errors = await authenticate(mode, input).catch(() => ({
        fields: {},
        form: "Unexpected error. Please try again.",
      }));
      if (errors) {
        return {
          fieldErrors: errors.fields,
          formError: errors.form,
          email: input.email,
          emailConfirmation: input.emailConfirmation,
        };
      }

      navigate("/");
      return initialState;
    },
    initialState,
  );

  return (
    <LoginForm
      mode={mode}
      action={formAction}
      state={state}
      isPending={isPending}
      onSwitchMode={onSwitchMode}
      onForgotPassword={() => console.log("forgot password")}
    />
  );
}
