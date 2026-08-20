"use client";

import { useEffect } from "react";

import { useAppDispatch } from "@/store/hooks";
import { checkAuth } from "@/modules/auth/store/authSlice";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return <>{children}</>;
}