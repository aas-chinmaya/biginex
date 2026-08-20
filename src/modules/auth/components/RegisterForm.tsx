"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";

import { Button, Input } from "@/components/ui";
import { useAppDispatch } from "@/store/hooks";
import { signupUser } from "@/modules/auth/store/authSlice";
import { notify } from "@/lib/toast";

export default function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleCreateAccount(e?: React.FormEvent) {
    e?.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim() || !confirmPassword.trim()) {
      notify.error("Please fill in all the fields.");
      return;
    }

    if (password !== confirmPassword) {
      notify.error("Password and confirm password must match.");
      return;
    }

    try {
      setSubmitting(true);

      const result = await dispatch(
        signupUser({
          fullName: name,
          email,
          password,
          contact: phone,
          role: "ADMIN",
        })
      );

      if (signupUser.fulfilled.match(result)) {
        notify.success("Account created successfully.");
        router.replace("/dashboard");
        return;
      }

      notify.error(result.payload || "Registration failed");
    } catch {
      notify.error("Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary">Biznex</h2>
        <p className="mt-2 text-sm text-muted">Smart Business Management Platform</p>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="mt-2 text-gray-500">Fill in your details to create an account.</p>
      </div>

      <form className="space-y-4" onSubmit={handleCreateAccount}>
        <div>
          <label className="mb-2 block text-sm font-medium">Full name</label>
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="pl-11"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="pl-11"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Phone</label>
          <div className="relative">
            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Mobile number"
              className="pl-11"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
              className="pl-11 pr-11"
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

        <div>
          <label className="mb-2 block text-sm font-medium">Confirm Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="pl-11 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
 
        <div className="flex items-center justify-between text-sm">
          <Link href="/login" className="ml-2 font-semibold text-primary hover:underline">
            Already have an account?
          </Link>

          <Button type="submit" className="ml-4" disabled={submitting}>
            {submitting ? "Creating..." : "Create Account"}
          </Button>
        </div>
      </form>
    </div>
  );
}