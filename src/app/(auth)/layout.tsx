import "@/app/globals.css";

import AuthBanner from "@/modules/auth/components/AuthBanner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Side */}
        <div className="hidden lg:flex">
          <AuthBanner />
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center bg-white px-6 py-10">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}