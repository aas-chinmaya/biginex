"use client";

import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface ToastProviderProps {
  children: ReactNode;
}

export default function ToastProvider({
  children,
}: ToastProviderProps) {
  return (
    <>
      {children}

      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,

          style: {
            borderRadius: "12px",
            background: "var(--color-surface)",
            color: "var(--color-text)",
            border: "1px solid #E5E7EB",
            padding: "14px",
          },

          success: {
            iconTheme: {
              primary: "#16A34A",
              secondary: "#ffffff",
            },
          },

          error: {
            iconTheme: {
              primary: "#DC2626",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </>
  );
}