"use client";

import {
  Building2,
  Users,
  UserCheck,
  TrendingUp,
} from "lucide-react";

interface BusinessStatsProps {
  branches: number;
  vendors: number;
  employees: number;
  revenue?: number;
}

export default function BusinessStats({
  branches,
  vendors,
  employees,
  revenue,
}: BusinessStatsProps) {
  const stats = [
    {
      title: "Branches",
      value: branches,
      icon: Building2,
      bg: "bg-primary/10",
      color: "text-primary",
    },
    {
      title: "Vendors",
      value: vendors,
      icon: Users,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Employees",
      value: employees,
      icon: UserCheck,
      bg: "bg-amber-100",
      color: "text-amber-600",
    },
    {
      title: "Revenue",
      value: revenue
        ? `₹${revenue.toLocaleString("en-IN")}`
        : "N/A",
      icon: TrendingUp,
      bg: "bg-cyan-100",
      color: "text-cyan-600",
    },
  ];

  return (
    <div
      className="
        grid
        grid-cols-2
        gap-4

        xl:grid-cols-4
      "
    >
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="
              group
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-4
              transition-all
              duration-300

              hover:-translate-y-1
              hover:border-primary/30
              hover:shadow-lg
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">
                  {item.title}
                </p>

                <h3 className="mt-2 text-2xl font-bold text-text">
                  {item.value}
                </h3>
              </div>

              <div
                className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  ${item.bg}
                `}
              >
                <Icon
                  size={24}
                  className={`${item.color}`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}