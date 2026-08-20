"use client";

import { Building2 } from "lucide-react";

import BranchCard from "./BranchCard";

import { Branch } from "../types";

interface BranchListProps {
  branches: Branch[];
  onEdit?: (branch: Branch) => void;
  onDelete?: (branch: Branch) => void;
}

export default function BranchList({
  branches,
  onEdit,
  onDelete,
}: BranchListProps) {
  if (!branches.length) {
    return (
      <div
        className="
          flex
          flex-col
          items-center
          justify-center
          rounded-xl
          border
          border-dashed
          border-gray-300
          bg-background
          px-6
          py-10
          text-center
        "
      >
        <div
          className="
            mb-4
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-primary/10
          "
        >
          <Building2
            size={30}
            className="text-primary"
          />
        </div>

        <h3 className="text-lg font-semibold text-text">
          No Branches Found
        </h3>

        <p className="mt-2 max-w-sm text-sm text-muted">
          This business doesn't have any branches yet.
          Click <strong>Add Branch</strong> to create one.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Section Header */}

      <div className="flex items-center justify-between">

        <div>
          <h3 className="text-lg font-semibold">
            Branches
          </h3>

          <p className="text-sm text-muted">
            {branches.length}{" "}
            {branches.length === 1
              ? "Branch"
              : "Branches"}
          </p>
        </div>

      </div>

      {/* Branch Grid */}

      <div
        className="
          grid
          gap-5

          md:grid-cols-2

          xl:grid-cols-2
        "
      >
        {branches.map((branch) => (
          <BranchCard
            key={branch.id}
            branch={branch}
            onEdit={(branch) => onEdit?.(branch)}
            onDelete={(branch) => onDelete?.(branch)}
          />
        ))}
      </div>

    </div>
  );
}