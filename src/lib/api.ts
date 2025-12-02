export type Organisation = { id: string; name: string; description?: string }
export type User = {
  id: string;
  username: string;
  role: "admin" | "member";
  organisationId: string;
  email?: string | null;
  emailVerified?: boolean;
};
export type MeResponse = { user: User; organisation: Organisation };
export type SignupResponse = {
  organisation: Organisation;
  user: Pick<User, "id" | "username" | "role" | "email" | "emailVerified">;
  message: string;
};
export type LoginResponse = {
  organisation: Pick<Organisation, "id" | "name">;
  user: Pick<User, "id" | "username" | "role" | "email" | "emailVerified">;
};
export type LogoutResponse = { ok: boolean };
export type VerifyEmailResponse = {
  message: string;
  user: Pick<User, "id" | "username" | "email" | "role" | "emailVerified">;
  organisation: Organisation;
};
export type ResendVerificationResponse = { message: string };

// Get API base URL from environment or default to relative path
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function json<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const url = typeof input === 'string' ? `${API_BASE_URL}${input}` : input;
  const res = await fetch(url, { credentials: "include", ...init });
  if (!res.ok) {
    let err: any = null;
    try {
      err = await res.json();
    } catch {}
    throw new Error(err?.error || res.statusText);
  }
  return res.json();
}

export const api = {
  health(): Promise<{ok: boolean}> {
    return json<{ok: boolean}>("/api/health");
  },
  organisations(): Promise<Organisation[]> {
    return json<Organisation[]>("/api/organisations");
  },
  signup(data: {
    orgName: string;
    description?: string;
    adminUsername: string;
    adminEmail: string;
    password: string;
  }): Promise<SignupResponse> {
    return json<SignupResponse>("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  login(data: {
    organisationId: string;
    usernameOrEmail: string;
    password: string;
  }): Promise<LoginResponse> {
    return json<LoginResponse>("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  logout(): Promise<LogoutResponse> {
    return json<LogoutResponse>("/api/auth/logout", { method: "POST" });
  },
  me(): Promise<MeResponse> {
    return json<MeResponse>("/api/auth/me");
  },
  verifyEmail(token: string): Promise<VerifyEmailResponse> {
    return json<VerifyEmailResponse>("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  },
  resendVerification(
    email: string,
    organisationId: string
  ): Promise<ResendVerificationResponse> {
    return json<ResendVerificationResponse>("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, organisationId }),
    });
  },
};
