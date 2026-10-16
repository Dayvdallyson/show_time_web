import { AtSign, Eye, EyeOff, Loader2, LockKeyhole, MailCheck } from "lucide-react";
import { useState, type ComponentProps, type MouseEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthFieldErrors, AuthMode } from "@/lib/auth";
import { cn } from "@/lib/utils";

export type LoginFormState = {
  fieldErrors: AuthFieldErrors;
  formError: string | null;
  email: string;
  emailConfirmation: string;
};

type LoginFormProps = Omit<ComponentProps<"form">, "action"> & {
  mode: AuthMode;
  action: (formData: FormData) => void;
  state: LoginFormState;
  isPending: boolean;
  onSwitchMode: (email: string) => void;
  onForgotPassword?: () => void;
};

const authButton =
  "bg-auth-button text-white hover:bg-auth-button-hover h-9 rounded-[5px] text-sm font-normal transition-colors duration-300 focus-visible:ring-white/30";

export function LoginForm({
  className,
  mode,
  action,
  state,
  isPending,
  onSwitchMode,
  onForgotPassword,
  ...props
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isRegister = mode === "register";
  const errors = state.fieldErrors;

  function switchMode(event: MouseEvent<HTMLButtonElement>) {
    const field = event.currentTarget.form?.elements.namedItem("email");
    onSwitchMode(field instanceof HTMLInputElement ? field.value : "");
  }

  return (
    <form action={action} noValidate className={cn("w-full max-w-[290px]", className)} {...props}>
      <Card className="bg-auth-surface gap-0 rounded-[25px] border-0 px-8 pt-10 pb-11 text-white shadow-none transition-transform duration-300 hover:scale-[1.02]">
        <CardHeader className="px-0">
          <CardTitle className="text-center text-xl font-normal">{isRegister ? "Sign up" : "Login"}</CardTitle>
        </CardHeader>

        <CardContent className="mt-14 flex flex-col gap-3 px-0">
          <AuthField id="email" icon={<AtSign />} label="Email" error={errors.email}>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              defaultValue={state.email}
              key={state.email}
              disabled={isPending}
              {...fieldA11y("email", errors.email)}
              className={fieldInput}
            />
          </AuthField>

          {isRegister ? (
            <AuthField
              id="emailConfirmation"
              icon={<MailCheck />}
              label="Confirm email"
              error={errors.emailConfirmation}
            >
              <Input
                id="emailConfirmation"
                name="emailConfirmation"
                type="email"
                autoComplete="email"
                placeholder="Confirm email"
                defaultValue={state.emailConfirmation}
                key={state.emailConfirmation}
                disabled={isPending}
                {...fieldA11y("emailConfirmation", errors.emailConfirmation)}
                className={fieldInput}
              />
            </AuthField>
          ) : null}

          <AuthField id="password" icon={<LockKeyhole />} label="Password" error={errors.password}>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isRegister ? "new-password" : "current-password"}
              placeholder="Password"
              disabled={isPending}
              {...fieldA11y("password", errors.password)}
              className={fieldInput}
            />
            <button
              type="button"
              onClick={() => setShowPassword(shown => !shown)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              disabled={isPending}
              className="text-neutral-400 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none [&_svg]:size-4"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </AuthField>

          <p role="alert" aria-live="polite" className="min-h-5 px-4 text-sm text-red-400">
            {state.formError}
          </p>
        </CardContent>

        <CardFooter className="mt-9 grid grid-cols-2 gap-2 px-0">
          {isRegister ? (
            <>
              <Button type="submit" disabled={isPending} className={authButton}>
                {isPending ? <Loader2 className="animate-spin" /> : null}
                {isPending ? "Signing up..." : "Sign up"}
              </Button>
              <Button type="button" onClick={switchMode} disabled={isPending} className={authButton}>
                Back to login
              </Button>
            </>
          ) : (
            <>
              <Button type="submit" disabled={isPending} className={authButton}>
                {isPending ? <Loader2 className="animate-spin" /> : null}
                {isPending ? "Signing in..." : "Sign in"}
              </Button>
              <Button type="button" onClick={switchMode} disabled={isPending} className={authButton}>
                Sign up
              </Button>
              <Button type="button" onClick={onForgotPassword} className={cn(authButton, "col-span-2")}>
                Forgot password
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}

const fieldInput =
  "h-auto flex-1 border-0 bg-transparent p-0 text-white shadow-none placeholder:text-neutral-500 focus-visible:ring-0 dark:bg-transparent md:text-sm";

function fieldA11y(id: string, error: string | undefined) {
  return error ? { "aria-invalid": true, "aria-describedby": `${id}-error` } : {};
}

function AuthField({
  id,
  icon,
  label,
  error,
  children,
}: {
  id: string;
  icon: ReactNode;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          "bg-auth-field shadow-auth-field flex items-center gap-2 rounded-[25px] px-4 py-2.5 focus-within:ring-1 focus-within:ring-white/20",
          error && "ring-1 ring-red-400/60",
        )}
      >
        <Label htmlFor={id} className="text-white [&_svg]:size-4">
          {icon}
          <span className="sr-only">{label}</span>
        </Label>
        {children}
      </div>
      {error ? (
        <p id={`${id}-error`} className="px-4 text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
