import { LoginForm } from "@/components/login-form";

export function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-neutral-200 p-4">
      <LoginForm
        onLogin={credentials => console.log("login", credentials.email)}
        onSignUp={() => console.log("sign up")}
        onForgotPassword={() => console.log("forgot password")}
      />
    </main>
  );
}
