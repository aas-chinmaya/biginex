"use client";

import { ReactNode } from "react";
import AuthBanner from "./AuthBanner";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left */}

        <AuthBanner />

        {/* Right */}

        <div className="flex items-center justify-center bg-white p-6 sm:p-10 lg:p-16">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}