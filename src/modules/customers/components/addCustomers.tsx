"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Textarea,
} from "@/components/ui";

import { FormField } from "@/components/form";
import { notify } from "@/lib/toast";
import {
  CustomerFormData,
  customerSchema,
} from "../validation";
import { customersService } from "../services/customers.service";

export default function AddCustomers() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customerCode: "",
      customerType: "WALK_IN",
      name: "",
      companyName: "",
      mobile: "",
      alternateMobile: "",
      email: "",
      gstin: "",
      pan: "",
      creditLimit: 0,
      creditDays: 0,
      openingBalance: 0,
      outstandingBalance: 0,
      rewardPoints: 0,
      isActive: true,
      notes: "",
    },
  });

  async function onSubmit(data: CustomerFormData) {
    try {
      await customersService.createCustomer(data);
      notify.success("Customer created successfully.");
      reset();
      router.push("/customers");
    } catch (error) {
      notify.error("Failed to create customer. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <p className="text-sm text-muted">Add customer identity and profile details.</p>
        </CardHeader>

        <CardContent className="grid gap-5 md:grid-cols-2">
          <FormField label="Customer Code" error={errors.customerCode?.message}>
            <Input placeholder="CUST001" {...register("customerCode")} />
          </FormField>

          <FormField label="Customer Type" error={errors.customerType?.message}>
            <Select
              value={watch("customerType")}
              onValueChange={(value) => setValue("customerType", value as "WALK_IN" | "REGULAR" | "WHOLESALE")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WALK_IN">WALK_IN</SelectItem>
                <SelectItem value="REGULAR">REGULAR</SelectItem>
                <SelectItem value="WHOLESALE">WHOLESALE</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Customer Name" required error={errors.name?.message}>
            <Input placeholder="John Doe" {...register("name")} />
          </FormField>

          <FormField label="Company Name" error={errors.companyName?.message}>
            <Input placeholder="Acme Traders" {...register("companyName")} />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Contact & Tax</h3>
          <p className="text-sm text-muted">Add phone, email and GST information.</p>
        </CardHeader>

        <CardContent className="grid gap-5 md:grid-cols-2">
          <FormField label="Mobile" required error={errors.mobile?.message}>
            <Input placeholder="9876543210" {...register("mobile")} />
          </FormField>

          <FormField label="Alternate Mobile" error={errors.alternateMobile?.message}>
            <Input placeholder="Optional" {...register("alternateMobile")} />
          </FormField>

          <FormField label="Email" error={errors.email?.message}>
            <Input placeholder="name@example.com" {...register("email")} />
          </FormField>

          <FormField label="GSTIN" error={errors.gstin?.message}>
            <Input placeholder="22AAAAA0000A1Z5" {...register("gstin")} />
          </FormField>

          <FormField label="PAN" error={errors.pan?.message}>
            <Input placeholder="ABCDE1234F" {...register("pan")} />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Credit & Status</h3>
          <p className="text-sm text-muted">Define credit limits, balances and customer status.</p>
        </CardHeader>

        <CardContent className="grid gap-5 md:grid-cols-3">
          <FormField label="Credit Limit" error={errors.creditLimit?.message}>
            <Input type="number" step="0.01" {...register("creditLimit", { valueAsNumber: true })} />
          </FormField>

          <FormField label="Credit Days" error={errors.creditDays?.message}>
            <Input type="number" {...register("creditDays", { valueAsNumber: true })} />
          </FormField>

          <FormField label="Opening Balance" error={errors.openingBalance?.message}>
            <Input type="number" step="0.01" {...register("openingBalance", { valueAsNumber: true })} />
          </FormField>

          <FormField label="Outstanding Balance" error={errors.outstandingBalance?.message}>
            <Input type="number" step="0.01" {...register("outstandingBalance", { valueAsNumber: true })} />
          </FormField>

          <FormField label="Reward Points" error={errors.rewardPoints?.message}>
            <Input type="number" {...register("rewardPoints", { valueAsNumber: true })} />
          </FormField>

          <FormField label="Status" error={errors.isActive?.message}>
            <Select
              value={watch("isActive") ? "ACTIVE" : "INACTIVE"}
              onValueChange={(value) => setValue("isActive", value === "ACTIVE")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Notes</h3>
          <p className="text-sm text-muted">Add internal notes for this customer.</p>
        </CardHeader>

        <CardContent>
          <FormField label="Notes" error={errors.notes?.message}>
            <Textarea placeholder="Enter notes" {...register("notes")} />
          </FormField>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button type="button" variant="secondary" onClick={() => reset()}>
          Reset
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Customer"}
        </Button>
      </div>
    </form>
  );
}
