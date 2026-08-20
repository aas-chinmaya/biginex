"use client";

import Image from "next/image";
import {
  ShieldCheck,
  Package,
  BarChart3,
  Smartphone,
} from "lucide-react";

export default function AuthBanner() {
  return (
    <div
      className="
      relative
      hidden
      overflow-hidden
      lg:flex
      flex-col
      justify-between
      bg-primary
      w-full
      p-16
      text-white
    "
    >
      {/* Background */}

      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white blur-3xl" />
      </div>

      {/* Logo */}

      <div className="relative z-10">
        <h1 className="text-5xl font-bold">
          Biznex
        </h1>

        <p className="mt-3 text-lg text-white/80">
          Next Generation Business ERP
        </p>
      </div>

      {/* Illustration */}

      <div className="relative z-10 flex justify-center">
        <Image
          src="/images/auth/biz-ban-1.svg"
          alt="ERP Dashboard"
          width={700}
          height={500}
          priority
        />
      </div>

      {/* Features */}

      <div className="relative z-10 space-y-6">

        <Feature
          icon={<Package size={24} />}
          title="Inventory Management"
          text="Manage products, stock and warehouses effortlessly."
        />

        <Feature
          icon={<BarChart3 size={24} />}
          title="Real-Time Reports"
          text="Sales, GST, Purchase and Profit reports instantly."
        />

        <Feature
          icon={<ShieldCheck size={24} />}
          title="Secure Cloud Backup"
          text="Keep your business data safe and synchronized."
        />

        <Feature
          icon={<Smartphone size={24} />}
          title="Works Offline"
          text="Continue billing even without internet."
        />

      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <div
        className="
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-xl
        bg-white/10
      "
      >
        {icon}
      </div>

      <div>
        <h3 className="font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-sm text-white/70">
          {text}
        </p>
      </div>
    </div>
  );
}