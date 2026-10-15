import { AtSign, Loader2, LockKeyhole } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type LoginFormState = { error: string | null; email: string };

type LoginFormProps = Omit<ComponentProps<"form">, "action"> & {
  action: (formData: FormData) => void;
  state: LoginFormState;
  isPending: boolean;
  onSignUp?: () => void;
  onForgotPassword?: () => void;
};

const authButton =
  "bg-auth-button text-white hover:bg-auth-button-hover h-9 rounded-[5px] text-sm font-normal transition-colors duration-300 focus-visible:ring-white/30";

export function LoginForm({
  className,
  action,
  state,
  isPending,
  onSignUp,
  onForgotPassword,
  ...props
}: LoginFormProps) {
  return (
    <form action={action} className={cn("w-full max-w-[290px]", className)} {...props}>
      <Card className="bg-auth-surface gap-0 rounded-[25px] border-0 px-8 pt-10 pb-11 text-white shadow-none transition-transform duration-300 hover:scale-[1.02]">
        <CardHeader className="px-0">
          <CardTitle className="text-center text-xl font-normal">Login</CardTitle>
        </CardHeader>

        <CardContent className="mt-14 flex flex-col gap-3 px-0">
          <AuthField id="email" icon={<AtSign />} label="Email">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              defaultValue={state.email}
              key={state.email}
              disabled={isPending}
              aria-invalid={state.error ? true : undefined}
              required
              className={fieldInput}
            />
          </AuthField>

          <AuthField id="password" icon={<LockKeyhole />} label="Senha">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Senha"
              disabled={isPending}
              aria-invalid={state.error ? true : undefined}
              required
              className={fieldInput}
            />
          </AuthField>

          <p role="alert" aria-live="polite" className="min-h-5 px-4 text-sm text-red-400">
            {state.error}
          </p>
        </CardContent>

        <CardFooter className="mt-9 grid grid-cols-2 gap-2 px-0">
          <Button type="submit" disabled={isPending} className={authButton}>
            {isPending ? <Loader2 className="animate-spin" /> : null}
            {isPending ? "Entrando..." : "Entrar"}
          </Button>
          <Button type="button" onClick={onSignUp} className={authButton}>
            Cadastrar
          </Button>
          <Button type="button" onClick={onForgotPassword} className={cn(authButton, "col-span-2")}>
            Esqueci a senha
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

const fieldInput =
  "h-auto flex-1 border-0 bg-transparent p-0 text-white shadow-none placeholder:text-neutral-500 focus-visible:ring-0 dark:bg-transparent md:text-sm";

function AuthField({ id, icon, label, children }: { id: string; icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="bg-auth-field shadow-auth-field flex items-center gap-2 rounded-[25px] px-4 py-2.5 focus-within:ring-1 focus-within:ring-white/20">
      <Label htmlFor={id} className="text-white [&_svg]:size-4">
        {icon}
        <span className="sr-only">{label}</span>
      </Label>
      {children}
    </div>
  );
}
