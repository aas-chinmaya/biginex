"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@/modules/users/types";

interface UserActionsProps {
  user: User;
  onView?: (user: User) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export default function UserActions({ user, onView, onEdit, onDelete }: UserActionsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="ghost" className="p-2 text-green-600 hover:bg-green-50 hover:text-green-600 rounded-lg transition" size="icon" onClick={() => onView?.(user)}>
        <Eye className="h-5 w-5" />
      </Button>
      <Button variant="ghost" className="p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition" size="icon" onClick={() => onEdit?.(user)}>
        <Pencil className="h-5 w-5" />
      </Button>
      <Button variant="ghost" className="p-2 text-red-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition" size="icon" onClick={() => onDelete?.(user)}>
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
