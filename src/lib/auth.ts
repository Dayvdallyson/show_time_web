export type LoginCredentials = { email: string; password: string };

export class LoginError extends Error {}

// Contrato: POST /api/auth/login { email, password } → 2xx com a sessão em cookie
// (o proxy do index.ts mantém tudo na mesma origem), ou { error } em caso de falha.
export async function login(credentials: LoginCredentials): Promise<void> {
  let response: Response;
  try {
    response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
  } catch {
    throw new LoginError("Não foi possível conectar ao servidor.");
  }

  if (response.ok) return;
  if (response.status === 401) throw new LoginError("Email ou senha inválidos.");
  if (response.status >= 500) throw new LoginError("Serviço indisponível. Tente novamente em instantes.");

  const body = await response.json().catch(() => null);
  throw new LoginError(body?.error ?? "Não foi possível entrar. Tente novamente.");
}
