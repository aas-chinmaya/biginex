"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

import { Button, Input } from "@/components/ui";
import { useAppDispatch } from "@/store/hooks";
import { forgotPasswordVerifyOTP } from "@/modules/auth/store/authSlice";
import { notify } from "@/lib/toast";

export default function CreatePasswordForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const isForgotPasswordFlow = searchParams.get("type") === "forgot-password";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isForgotPasswordFlow && !sessionStorage.getItem("forgotPasswordEmail")) {
      router.replace("/forgot-password");
    }
  }, [isForgotPasswordFlow, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      notify.error("Please fill all fields.");
      return;
    }

    if (password.length < 8) {
      notify.error("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      notify.error("Passwords do not match.");
      return;
    }

    const email = sessionStorage.getItem("forgotPasswordEmail");
    const otp = sessionStorage.getItem("forgotPasswordOtp");

    if (!email || !otp) {
      notify.error("Password reset session expired. Please start again.");
      router.replace("/forgot-password");
      return;
    }

    try {
      setSubmitting(true);
      const result = await dispatch(
        forgotPasswordVerifyOTP({ email, otp, newPassword: password })
      );

      if (forgotPasswordVerifyOTP.fulfilled.match(result)) {
        sessionStorage.removeItem("forgotPasswordEmail");
        sessionStorage.removeItem("forgotPasswordOtp");
        notify.success("Password reset successfully. Please log in.");
        router.replace("/login");
        return;
      }

      notify.error(result.payload || "Password reset failed.");
    } catch {
      notify.error("Password reset failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <ShieldCheck
            size={30}
            className="text-primary"
          />
        </div>
      </div>

      {/* Heading */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">
          Reset Password
        </h1>

        <p className="text-gray-500">
          Reset a secure password to protect your
          Biznex account.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Password
          </label>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <Input
              type={
                showPassword ? "text" : "password"
              }
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="pl-11 pr-12"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Confirm Password
          </label>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <Input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="pl-11 pr-12"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Password Rules */}
        <div className="rounded-xl bg-primary/5 p-4 text-sm text-gray-600">
          <p className="mb-2 font-medium">
            Password should contain:
          </p>

          <ul className="list-inside list-disc space-y-1">
            <li>Minimum 8 characters</li>
            <li>One uppercase letter</li>
            <li>One lowercase letter</li>
            <li>One number</li>
            <li>One special character</li>
          </ul>
        </div>

        {/* Button */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Reset Password"}
        </Button>

        <p className="text-center text-sm text-gray-500">
          <Link
            href="/verify-otp?type=forgot-password"
            className="font-medium text-primary hover:underline"
          >
            ← Back to OTP Verification
          </Link>
        </p>
      </form>
    </div>
  );
}