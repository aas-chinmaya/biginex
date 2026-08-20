import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-white to-primary/5" />

        {/* Decorative Circles */}
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-1">
              {"BIZNEX".split("").map((letter, index) => (
                <div
                  key={index}
                  className="
                    flex
                    h-10
                    w-10
                    sm:h-12
                    sm:w-12
                    lg:h-16
                    lg:w-16
                    items-center
                    justify-center
                    rounded-lg
                    lg:rounded-lg
                    bg-primary
                    text-lg
                    sm:text-xl
                    lg:text-3xl
                    font-bold
                    text-white
                    shadow-md
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:scale-105
                  "
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>

          {/* Heading */}
          <h1 className="max-w-4xl text-5xl font-bold leading-tight text-gray-900 lg:text-7xl">
            Next Generation
            <br />
            <span className="text-primary">
              Business Management
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-600">
            Manage Products, Inventory, Sales, Purchases,
            Customers, Suppliers, GST, Reports and much more
            from a single intelligent ERP platform.
          </p>

          {/* Features */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-gray-600">
            {[
              "GST Ready",
              "Offline First",
              "Cloud Sync",
              "Inventory Management",
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2"
              >
                <CheckCircle2
                  className="text-primary"
                  size={18}
                />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-14 flex flex-col gap-4 sm:flex-row">
            <Link href="/login">
              <Button
                size="lg"
                className="min-w-[180px]"
              >
                Login
              </Button>
            </Link>

            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="min-w-[180px]"
              >
                Get Started
                <ArrowRight
                  className="ml-2"
                  size={18}
                />
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <p className="mt-14 text-sm text-gray-500">
            © 2026 Biznex ERP • Secure • Fast • Offline Ready
          </p>
        </div>
      </section>
    </main>
  );
}