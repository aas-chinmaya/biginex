"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui";
import UserActions from "./UserActions";
import type { User } from "@/modules/users/types";

export const UserColumns: ColumnDef<User>[] = [
  {
    accessorKey: "fullName",
    header: "User",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-gray-900">{row.original.fullName}</p>
        <p className="text-sm text-gray-500">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "contact",
    header: "Contact",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant="primary">{row.original.role?.name || "User"}</Badge>
    ),
  },
  {
    accessorKey: "isDeleted",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.isDeleted ? "danger" : "success"}>
        {row.original.isDeleted ? "Inactive" : "Active"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <UserActions user={row.original} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
