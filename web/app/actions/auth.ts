"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthApiResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

interface ActionResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

const getApiBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
    "http://localhost:8000"
  );
};

export async function loginAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse<User>> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validation
  if (!email || !password) {
    return {
      success: false,
      message: "Please fill in all fields",
    };
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || "Login failed. Please try again.",
      };
    }

    const data: AuthApiResponse = await response.json();

    // Set httpOnly cookie for security
    const cookieStore = await cookies();
    cookieStore.set("auth-token", data.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return {
      success: true,
      data: data.data.user,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function registerAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse<User>> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const password_confirmation = formData.get("password_confirmation") as string;

  // Validation
  if (!name || !email || !password || !password_confirmation) {
    return {
      success: false,
      message: "Please fill in all fields",
    };
  }

  if (password !== password_confirmation) {
    return {
      success: false,
      message: "Passwords do not match",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters long",
    };
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name, email, password, password_confirmation }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || "Registration failed. Please try again.",
      };
    }

    const data: AuthApiResponse = await response.json();

    // Set httpOnly cookie for security
    const cookieStore = await cookies();
    cookieStore.set("auth-token", data.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return {
      success: true,
      data: data.data.user,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  redirect("/login");
}
