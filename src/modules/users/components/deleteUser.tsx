"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { User } from "@/modules/users/types";

interface DeleteUserProps {
  user: User;
  onDelete: () => Promise<void> | void;
}

export default function DeleteUser({ user, onDelete }: DeleteUserProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${user.fullName}?`)) return;

    try {
      setLoading(true);
      await onDelete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="danger" size="sm" onClick={handleDelete} disabled={loading}>
      {loading ? "Deleting..." : "Delete"}
    </Button>
  );
}
