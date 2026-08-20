"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button, Input, Checkbox } from "@/components/ui";
import { useAppDispatch } from "@/store/hooks";
import { checkAuth, loginUser } from "@/modules/auth/store/authSlice";
import { notify } from "@/lib/toast";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const verifyExistingSession = async () => {
      const result = await dispatch(checkAuth());

      if (checkAuth.fulfilled.match(result) && result.payload?.user) {
        router.replace("/dashboard");
      }
    };

    void verifyExistingSession();
  }, [dispatch, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      notify.error("Please enter your email and password.");
      return;
    }

    try {
      setSubmitting(true);
      const result = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(result)) {
        sessionStorage.setItem("pendingLoginEmail", email);
        sessionStorage.setItem("pendingLoginPassword", password);
        router.push("/verify-otp");
        return;
      }

      notify.error(result.payload || "Login failed");
    } catch {
      notify.error("Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome Back
        </h1>

        <p className="text-gray-500">
          Sign in to continue to your Biznex account.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Email or Mobile Number
          </label>

          <Input
            placeholder="Enter email or mobile number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Password
          </label>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox />
            Remember me
          </label>

          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={submitting}>
          <LogIn size={18} />
          {submitting ? "Logging in..." : "Login"}
        </Button>
      </form>

      <div className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}