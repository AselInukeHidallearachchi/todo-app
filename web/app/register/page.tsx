"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Loader,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Check,
} from "lucide-react";
import Link from "next/link";

interface PasswordStrength {
  score: number;
  feedback: string;
  color: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (password: string): PasswordStrength => {
    if (!password) return { score: 0, feedback: "", color: "bg-muted" };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    if (score <= 2)
      return { score: 1, feedback: "Weak", color: "bg-destructive" };
    if (score <= 3) return { score: 2, feedback: "Fair", color: "bg-warning" };
    if (score <= 4) return { score: 3, feedback: "Good", color: "bg-info" };
    return { score: 4, feedback: "Strong", color: "bg-success" };
  };

  const passwordStrength = getPasswordStrength(form.password);
  const isPasswordMatch =
    form.password && form.password === form.password_confirmation;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.password_confirmation
    ) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!isPasswordMatch) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/register", form);
      const { token, user } = res.data as { token: string; user: User };
      setUser(user, token);
      router.push("/");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-primary/10 rounded-xl mb-4">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Get started
          </h1>
          <p className="text-muted-foreground">
            Create your account and start organizing
          </p>
        </div>

        <Card className="p-6 shadow-soft-xl border-border/40">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
                className="h-10"
                autoFocus
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                className="h-10"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {form.password && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all`}
                        style={{
                          width: `${(passwordStrength.score / 4) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {passwordStrength.feedback}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password_confirmation"
                className="text-sm font-semibold"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {form.password_confirmation && (
                <div
                  className={`text-xs flex items-center gap-2 ${
                    isPasswordMatch ? "text-success" : "text-destructive"
                  }`}
                >
                  {isPasswordMatch ? (
                    <>
                      <Check className="h-4 w-4" />
                      Passwords match
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4" />
                      Passwords do not match
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={
                loading ||
                !form.name ||
                !form.email ||
                !form.password ||
                !isPasswordMatch
              }
              className="w-full h-10 gap-2 shadow-soft-md hover:shadow-soft-lg transition-shadow mt-6"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-background text-muted-foreground">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link href="/login">
            <Button type="button" variant="outline" className="w-full h-10">
              Sign in
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
