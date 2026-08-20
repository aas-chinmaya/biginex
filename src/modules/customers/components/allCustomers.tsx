"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCustomers, setLoading } from "../store/customers.slice";
import { customersService } from "../services/customers.service";
import { Customer } from "../types";
import { notify } from "@/lib/toast";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/DataTable";
import Search from "@/components/data-table/Search";
import Pagination from "@/components/data-table/Pagination";
import { Badge } from "@/components/ui/badge";

export default function AllCustomers() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { customers, loading } = useAppSelector((state) => state.customers);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.mobile.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredCustomers.length / pageSize);

  // Fetch customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      dispatch(setLoading(true));
      const response = await customersService.getCustomers();
      dispatch(setCustomers(response.data || response));
    } catch (error) {
      notify.error("Failed to fetch customers. Please try again.");
      console.error("Error fetching customers:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "customerCode",
      header: "Code",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("customerCode") || "N/A"}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.getValue("name")}</p>
          <p className="text-xs text-gray-500">
            {row.original.companyName || "N/A"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "customerType",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("customerType") as string;
        const variants: Record<string, any> = {
          WALK_IN: "default",
          REGULAR: "secondary",
          WHOLESALE: "outline",
        };
        return <Badge variant={variants[type] || "default"}>{type}</Badge>;
      },
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
      cell: ({ row }) => <span>{row.getValue("mobile")}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("email") || "N/A"}</span>
      ),
    },
    {
      accessorKey: "creditLimit",
      header: "Credit Limit",
      cell: ({ row }) => (
        <span className="font-semibold">
          ₹{(row.getValue("creditLimit") as number).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge variant={isActive ? "secondary" : "destructive"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Search and Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 max-w-md">
          <Search
            placeholder="Search by name, mobile, or email..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
        <Button
          onClick={() => router.push("/customers/add")}
          className="w-full sm:w-auto"
        >
          + Add Customer
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={paginatedCustomers}
        loading={loading}
        emptyMessage={
          filteredCustomers.length === 0
            ? searchTerm
              ? "No customers found matching your search."
              : "No customers found. Click 'Add Customer' to create one."
            : "Loading..."
        }
      />

      {/* Pagination */}
      {!loading && filteredCustomers.length > 0 && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          totalRecords={filteredCustomers.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
