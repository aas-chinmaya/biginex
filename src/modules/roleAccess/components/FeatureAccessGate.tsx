"use client";

import { useMemo, type ReactNode } from "react";
import { useAppSelector } from "@/store/hooks";
import { hasAccessToFeature } from "@/modules/roleAccess/utils/access";

interface FeatureAccessGateProps {
  children: ReactNode;
  featureName?: string;
  route?: string;
  fallback?: ReactNode;
}

export default function FeatureAccessGate({
  children,
  featureName,
  route,
  fallback = null,
}: FeatureAccessGateProps) {
  const { user } = useAppSelector((state) => state.auth);
  const { accessTree, permissions } = useAppSelector((state) => state.roleAccess);

  const isAllowed = useMemo(
    () => hasAccessToFeature(accessTree, route, permissions, featureName, user?.role),
    [accessTree, permissions, route, featureName, user?.role],
  );

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
