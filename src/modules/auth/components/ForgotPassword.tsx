"use client";

import { useState } from "react";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button, Input } from "@/components/ui";
import { useAppDispatch } from "@/store/hooks";
import { forgotPasswordSendOTP } from "@/modules/auth/store/authSlice";
import { notify } from "@/lib/toast";

export default function ForgotPassword() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [identifier, setIdentifier] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedValue = identifier.trim();

    if (!trimmedValue) {
      notify.error("Please enter your email or mobile number.");
      return;
    }

    try {
      setSubmitting(true);

      const result = await dispatch(forgotPasswordSendOTP({ email: trimmedValue }));

      if (forgotPasswordSendOTP.fulfilled.match(result)) {
        sessionStorage.setItem("forgotPasswordEmail", trimmedValue);
        sessionStorage.removeItem("forgotPasswordOtp");
        notify.success("OTP sent successfully.");
        router.push("/verify-otp?type=forgot-password");
        return;
      }

      notify.error(result.payload || "Failed to send OTP.");
    } catch {
      notify.error("Failed to send OTP.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Forgot Password</h1>
        <p className="text-gray-500">Enter your email or mobile number to receive a verification code.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Email or Mobile Number</label>
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter email or mobile number"
              className="pl-11"
            />
          </div>
        </div>

        <div className="rounded-xl bg-primary/5 p-4 text-sm text-gray-600">
          <div className="flex items-start gap-3">
            <Phone size={16} className="mt-0.5 text-primary" />
            <p>We will send a 6-digit OTP to the email or mobile number you provide.</p>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={submitting}>
          {submitting ? "Sending..." : "Send OTP"}
        </Button>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="flex w-full items-center justify-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Login
        </button>
      </form>
    </div>
  );
}
