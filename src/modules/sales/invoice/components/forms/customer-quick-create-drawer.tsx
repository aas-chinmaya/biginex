
"use client";

import { useState, type ReactNode } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn, useWatch } from "react-hook-form";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import {
  Building2, Globe, Hash, Landmark, Mail, MapPin, Phone,
  Route, Save, User, UserPlus, X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";

import { notify } from "@/lib/toast";
import { customersService } from "@/modules/customers/services/customers.service";
import { addCustomer } from "@/modules/customers/store/customers.slice";
import type { Customer } from "@/modules/customers/types";

const BUSINESS_ID = "YOUR_BUSINESS_CUID";
const CREATED_BY = "YOUR_USER_CUID";
const BRANCH_ID = "YOUR_BRANCH_CUID";

const addressSchema = z.object({
  addressLine1: z.string().trim().min(1, "Address is required."),
  addressLine2: z.string().trim().optional(),
  landmark: z.string().trim().optional(),
  city: z.string().trim().min(1, "City is required."),
  state: z.string().trim().min(1, "State is required."),
  country: z.string().trim().min(1, "Country is required."),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode."),
  ewayDistance: z.coerce.number().min(0).optional(),
});

const schema = z.object({
  customerType: z.enum(["WALK_IN", "REGULAR", "WHOLESALE"]),
  name: z.string().trim().min(1, "Customer name is required."),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number."),
  companyName: z.string().trim().optional(),
  email: z.string().trim().email("Invalid email.").optional().or(z.literal("")),
  gstin: z.string().trim().toUpperCase()
    .regex(/^[0-9A-Z]{15}$/, "Invalid GSTIN.")
    .optional().or(z.literal("")),
  pan: z.string().trim().toUpperCase()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN.")
    .optional().or(z.literal("")),
  billingAddress: addressSchema,
  shippingAddress: addressSchema.optional(),
});

type FormData = z.infer<typeof schema>;
type Form = UseFormReturn<FormData>;

const emptyAddress = {
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  ewayDistance: undefined,
};

const defaults: FormData = {
  customerType: "WALK_IN",
  name: "",
  mobile: "",
  companyName: "",
  email: "",
  gstin: "",
  pan: "",
  billingAddress: { ...emptyAddress },
  shippingAddress: { ...emptyAddress },
};

const customerFields = [
  ["name", "Customer Name", "Enter customer name", User, true],
  ["mobile", "Mobile Number", "10-digit mobile", Phone, true, "tel", "numeric", "number", 10],
  ["companyName", "Company Name", "Enter company name", Building2],
  ["email", "Email", "name@example.com", Mail, false, "email", "email", "email"],
  ["gstin", "GSTIN", "15-character GSTIN", Building2, false, "text", "text", "upper", 15],
  ["pan", "PAN", "10-character PAN", Hash, false, "text", "text", "upper", 10],
].map(([name, label, placeholder, icon, required, type, inputMode, sanitize, maxLength]) => ({
  name, label, placeholder, icon, required, type, inputMode, sanitize, maxLength,
}));

const addressFields = (prefix: string) =>
  [
    ["addressLine1", "Address 1", "House / Flat / Street", MapPin, true],
    ["addressLine2", "Address 2", "Area / Locality / Building", MapPin],
    ["landmark", "Landmark", "Nearby landmark", Landmark],
    ["city", "City", "Enter city", Building2, true],
    ["state", "State", "Enter state", MapPin, true],
    ["country", "Country", "Enter country", Globe, true],
    ["pincode", "Pincode", "6-digit pincode", Hash, true, "text", "numeric", "number", 6],
    ["ewayDistance", "E-way Distance", "Distance in km", Route, false, "number", "decimal", "decimal"],
  ].map(([name, label, placeholder, icon, required, type, inputMode, sanitize, maxLength]) => ({
    name: `${prefix}.${name}`,
    label, placeholder, icon, required, type, inputMode, sanitize, maxLength,
  }));

export default function CustomerQuickCreateDrawer({
  children,
  onCreated,
}: {
  children: ReactNode;
  onCreated: (customer: Customer) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  const form = useForm<FormData>({
    defaultValues: defaults,
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const billingAddress = useWatch({
    control: form.control,
    name: "billingAddress",
  });

  const reset = () => {
    form.reset(defaults);
    setSameAsBilling(true);
  };

  const toggleShipping = (checked: boolean) => {
    setSameAsBilling(checked);

    form.setValue(
      "shippingAddress",
      checked ? { ...billingAddress } : { ...emptyAddress },
      { shouldDirty: false, shouldValidate: false },
    );
  };

  const submit = async (values: FormData) => {
    try {
      const shipping = sameAsBilling
        ? values.billingAddress
        : values.shippingAddress;

      if (!shipping) throw new Error("Shipping address is required.");

      const payload = {
        businessId: BUSINESS_ID,
        createdBy: CREATED_BY,
        branchId: BRANCH_ID,
        customerType: values.customerType,
        name: values.name.trim(),
        mobile: values.mobile.trim(),
        ...(values.companyName?.trim() && {
          companyName: values.companyName.trim(),
        }),
        ...(values.email?.trim() && {
          email: values.email.trim().toLowerCase(),
        }),
        ...(values.gstin?.trim() && {
          gstin: values.gstin.trim().toUpperCase(),
        }),
        ...(values.pan?.trim() && {
          pan: values.pan.trim().toUpperCase(),
        }),
        addresses: [
          { type: "BILLING", ...values.billingAddress },
          { type: "SHIPPING", ...shipping },
        ],
      };

      const customer = await customersService.createCustomer(payload);

      dispatch(addCustomer(customer));
      onCreated(customer);

      notify.success("Customer added successfully.");
      reset();
      setOpen(false);
    } catch (error) {
      console.error(error);
      notify.error(
        error instanceof Error
          ? error.message
          : "Unable to create customer.",
      );
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full max-w-2xl flex-col gap-0 p-0"
      >
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-base">
            <span className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <UserPlus className="size-4" />
            </span>
            Add Customer
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={form.handleSubmit(submit)}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            <Section title="Customer Details" icon={<User />}>
              <Row label="Customer Type">
                <RadioGroup
                  value={form.watch("customerType")}
                  onValueChange={(v) =>
                    form.setValue(
                      "customerType",
                      v as FormData["customerType"],
                    )
                  }
                  className="flex flex-wrap gap-5"
                >
                  {["WALK_IN", "REGULAR", "WHOLESALE"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 text-sm"
                    >
                      <RadioGroupItem value={type} />
                      {type.replace("_", " ")}
                    </label>
                  ))}
                </RadioGroup>
              </Row>

              {customerFields.map((f) => (
                <Field key={f.name} form={form} {...f} />
              ))}
            </Section>

            <Section title="Billing Address" icon={<MapPin />}>
              {addressFields("billingAddress").map((f) => (
                <Field key={f.name} form={form} {...f} />
              ))}
            </Section>

            <Section title="Shipping Address" icon={<MapPin />}>
              <Row label="Same as Billing">
                <label className="flex h-9 items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    checked={sameAsBilling}
                    onCheckedChange={(v) => toggleShipping(v === true)}
                  />
                  Use billing address
                </label>
              </Row>

              {!sameAsBilling &&
                addressFields("shippingAddress").map((f) => (
                  <Field key={f.name} form={form} {...f} />
                ))}
            </Section>
          </div>

          <footer className="flex justify-between border-t px-4 py-3 sm:px-6">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              <X /> Cancel
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={form.formState.isSubmitting}
            >
              <Save />
              {form.formState.isSubmitting ? "Saving..." : "Save Customer"}
            </Button>
          </footer>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function Field({
  form,
  name,
  label,
  placeholder,
  icon: Icon,
  required,
  type = "text",
  inputMode,
  sanitize,
  maxLength,
}: any & { form: Form }) {
  const error = name
    .split(".")
    .reduce((o: any, k: string) => o?.[k], form.formState.errors)?.message;

  return (
    <Row label={label} required={required} error={error}>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          {...form.register(name as never)}
          type={type}
          inputMode={inputMode}
          placeholder={placeholder}
          maxLength={maxLength}
          min={type === "number" ? 0 : undefined}
          className="h-9 pl-9"
          onChange={(e) => {
            let v = e.target.value;

            if (sanitize === "number") v = v.replace(/\D/g, "");
            if (sanitize === "decimal")
              v = v.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
            if (sanitize === "upper")
              v = v.toUpperCase().replace(/[^A-Z0-9]/g, "");
            if (sanitize === "email")
              v = v.toLowerCase().replace(/\s/g, "");

            form.setValue(
              name as never,
              v.slice(0, maxLength) as never,
              { shouldDirty: true, shouldValidate: true },
            );
          }}
        />
      </div>
    </Row>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mb-7">
      <div className="mb-3 flex items-center gap-2 border-b pb-3">
        <span className="text-muted-foreground">{icon}</span>
        <h2 className="text-sm font-medium">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Row({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid items-start gap-1.5 sm:grid-cols-[145px_minmax(0,1fr)] sm:gap-3">
      <Label className="pt-2 text-sm font-normal text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>

      <div>
        {children}
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}