"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  homeLabel?: string;
}

const formatLabel = (segment: string) => {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function Breadcrumb({
  homeLabel = "Dashboard",
}: BreadcrumbProps) {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => ({
    label: formatLabel(segment),
    href: "/" + segments.slice(0, index + 1).join("/"),
  }));

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center text-sm mb-5"
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-gray-500 transition hover:text-violet-600"
          >
            <Home size={16} />
            <span>{homeLabel}</span>
          </Link>
        </li>

        {breadcrumbs.map((item, index) => {
          const isLast =
            index === breadcrumbs.length - 1;

          return (
            <li
              key={item.href}
              className="flex items-center gap-2"
            >
              <ChevronRight
                size={16}
                className="text-gray-400"
              />

              {isLast ? (
                <span className="font-medium text-gray-900">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 transition hover:text-violet-600"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}