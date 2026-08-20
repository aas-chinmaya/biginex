"use client";

import { lazy, Suspense, type ComponentType } from "react";
import type { LucideProps } from "lucide-react";

type IconComponent = ComponentType<LucideProps>;

const iconCache = new Map<string, IconComponent>();

const loadIcon = (iconName: string): IconComponent => {
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName)!;
  }

  const LazyIcon = lazy(async () => {
    const icons = await import("lucide-react");

    const Icon = icons[iconName as keyof typeof icons];

    if (!Icon || typeof Icon !== "object" && typeof Icon !== "function") {
      const Fallback = icons.Store;
      return {
        default: Fallback,
      };
    }

    return {
      default: Icon as IconComponent,
    };
  });

  iconCache.set(iconName, LazyIcon);

  return LazyIcon;
};

interface LucideIconRendererProps extends LucideProps {
  name?: string;
}

export default function LucideIconRenderer({
  name,
  ...props
}: LucideIconRendererProps) {
  if (!name) {
    return null;
  }

  const Icon = loadIcon(name);

  return (
    <Suspense
      fallback={
        <span className="h-4 w-4 animate-pulse rounded-sm bg-slate-200" />
      }
    >
      <Icon {...props} />
    </Suspense>
  );
}