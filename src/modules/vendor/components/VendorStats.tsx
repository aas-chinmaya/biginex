"use client";

import {
  Users,
  UserCheck,
  IndianRupee,
  Wallet,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui";

interface VendorStatsProps {
  totalVendors: number;
  activeVendors: number;
  totalPurchase: number;
  outstanding: number;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);

export default function VendorStats({
  totalVendors,
  activeVendors,
  totalPurchase,
  outstanding,
}: VendorStatsProps) {
  const stats = [
    {
      title: "Total Vendors",
      value: totalVendors,
      icon: Users,
      iconBg: "bg-sky-50",
      iconColor: "text-primary",
      ring: "ring-primary/50",
      trend: "+12.4% this month",
      trendUp: true,
      progress: "72%",
      progressColor: "bg-primary",
    },
    {
      title: "Active Vendors",
      value: activeVendors,
      icon: UserCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      ring: "ring-emerald-100",
      trend: "+8.8% this month",
      trendUp: true,
      progress: "64%",
      progressColor: "bg-emerald-500",
    },
    {
      title: "Total Purchase",
      value: `₹${formatCurrency(totalPurchase)}`,
      icon: IndianRupee,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      ring: "ring-violet-100",
      trend: "+18.2% this month",
      trendUp: true,
      progress: "88%",
      progressColor: "bg-violet-500",
    },
    {
      title: "Outstanding",
      value: `₹${formatCurrency(outstanding)}`,
      icon: Wallet,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      ring: "ring-amber-100",
      trend: "-2.1% this month",
      trendUp: false,
      progress: "42%",
      progressColor: "bg-amber-500",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trendUp ? TrendingUp : TrendingDown;

        return (
          <Card
            key={stat.title}
            className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-800">
                    {stat.value}
                  </h2>

                  <p
                    className={`mt-2.5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      stat.trendUp
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    <TrendIcon size={12} />
                    {stat.trend}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconBg} ring-1 ${stat.ring} transition-transform duration-200 group-hover:scale-105`}
                >
                  <Icon size={20} className={stat.iconColor} />
                </div>
              </div>

              {/* Soft progress bar */}
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${stat.progressColor} transition-all duration-500`}
                  style={{ width: stat.progress }}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}