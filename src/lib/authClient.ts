import type { User } from "@/types";

interface ApiErrorBody {
  error?: string;
  message?: string;
}

interface AuthPayload {
  user: User;
}

const AUTH_BASE_URL = (import.meta.env.VITE_AUTH_BASE_URL ?? "/api").replace(/\/$/, "");

const toAuthErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof TypeError) {
    return "Authentication service is unavailable. Please try again.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${AUTH_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = "Request failed";

    try {
      const errorBody = (await response.json()) as ApiErrorBody;
      message = errorBody.error ?? errorBody.message ?? message;
    } catch {
      // Use default fallback.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

export const getCurrentUser = async () => {
  try {
    return await request<AuthPayload>("/auth/me");
  } catch (error) {
    throw new Error(toAuthErrorMessage(error, "Unable to restore your session."));
  }
};

export const loginRequest = async (username: string, password: string) => {
  try {
    return await request<AuthPayload>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  } catch (error) {
    throw new Error(toAuthErrorMessage(error, "Invalid username or password."));
  }
};

export const registerRequest = async (username: string, email: string, password: string) => {
  try {
    return await request<AuthPayload>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
  } catch (error) {
    throw new Error(toAuthErrorMessage(error, "Unable to create account."));
  }
};

export const logoutRequest = async () => {
  try {
    await request<void>("/auth/logout", { method: "POST" });
  } catch {
    // Always clear client state, even if the server session is already gone.
  }
};
