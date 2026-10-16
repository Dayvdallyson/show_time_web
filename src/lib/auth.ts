import { z } from "zod";

export type AuthMode = "login" | "register";
export type AuthField = "email" | "emailConfirmation" | "password";
export type AuthFieldErrors = Partial<Record<AuthField, string>>;
export type AuthErrors = { fields: AuthFieldErrors; form: string | null };
export type AuthInput = Record<AuthField, string>;

const AUTH_FIELDS: AuthField[] = ["email", "emailConfirmation", "password"];
const ENDPOINTS: Record<AuthMode, string> = { login: "/api/auth/login", register: "/api/auth/register" };

const normalizedEmail = z.string().trim().toLowerCase();

const email = normalizedEmail.pipe(
  z.email("Invalid email").max(255, "Email must be at most 255 characters"),
);

const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters");

const loginSchema = z.object({ email, password });

const registerSchema = z
  .object({ email, emailConfirmation: normalizedEmail, password })
  .refine(data => data.email === data.emailConfirmation, {
    path: ["emailConfirmation"],
    error: "Emails do not match",
  });

type ErrorBody = { error?: string; issues?: Record<string, string[] | undefined> };

export async function authenticate(mode: AuthMode, input: AuthInput): Promise<AuthErrors | null> {
  const parsed = mode === "login" ? loginSchema.safeParse(input) : registerSchema.safeParse(input);
  if (!parsed.success) return { fields: firstErrors(z.flattenError(parsed.error).fieldErrors), form: null };

  let response: Response;
  try {
    response = await fetch(ENDPOINTS[mode], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: parsed.data.email, password: parsed.data.password }),
    });
  } catch {
    return formError("Could not connect to the server.");
  }

  if (response.ok) return null;
  if (response.status >= 500) return formError("Service unavailable. Please try again shortly.");
  if (response.status === 401) return formError("Invalid email or password.");

  const body: ErrorBody | null = await response.json().catch(() => null);

  if (response.status === 409) return { fields: { email: body?.error ?? "Email already registered" }, form: null };

  if (response.status === 400 && body?.issues) {
    const fields = firstErrors(body.issues);
    if (Object.keys(fields).length > 0) return { fields, form: null };
  }

  return formError(body?.error ?? "Something went wrong. Please try again.");
}

function formError(message: string): AuthErrors {
  return { fields: {}, form: message };
}

function firstErrors(issues: Partial<Record<string, string[]>>): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  for (const field of AUTH_FIELDS) {
    const message = issues[field]?.[0];
    if (message) errors[field] = message;
  }
  return errors;
}
