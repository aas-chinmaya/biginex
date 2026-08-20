

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Fingerprint,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Search,
  Tag,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { customersService } from "@/modules/customers/services/customers.service";
import {
  setCustomers as setCustomersAction,
  setError as setErrorAction,
  setLoading as setLoadingAction,
  setSelectedCustomer as setSelectedCustomerAction,
} from "@/modules/customers/store/customers.slice";
import type { InvoiceFormValues } from "../../types/invoice-form.types";
import CustomerQuickCreateDrawer from "./customer-quick-create-drawer";
import { getStateCode } from "./invoice-form-utils";

// ---- Shapes matching the real customer API response ----
type CustomerAddress = {
  id: string;
  type: "BILLING" | "SHIPPING" | string;
  label?: string | null;
  contactPerson?: string | null;
  contactNumber?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  landmark?: string | null;
  city?: string | null;
  district?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;
  stateCode?: string | null;
  isDefault?: boolean;
  isActive?: boolean;
};

type CustomerDetails = {
  id: string;
  customerType?: string | null;
  name?: string | null;
  mobile?: string | null;
  alternateMobile?: string | null;
  email?: string | null;
  gstin?: string | null;
  pan?: string | null;
  companyName?: string | null;
  isActive?: boolean;
  addresses?: CustomerAddress[] | null;
};

// ---- Small formatting helpers ----
function clean(value?: string | null) {
  return value && value.trim() ? value.trim() : "";
}

function formatCustomerType(type?: string | null) {
  if (!type) return "—";
  return type
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function getAddressByType(
  customer: CustomerDetails | undefined,
  type: "BILLING" | "SHIPPING",
) {
  const addresses = (customer?.addresses ?? []).filter(
    (a) => a.isActive !== false,
  );
  return (
    addresses.find((a) => a.type === type && a.isDefault) ??
    addresses.find((a) => a.type === type) ??
    null
  );
}

function getShippingAddresses(customer: CustomerDetails | undefined) {
  return (customer?.addresses ?? []).filter(
    (a) => a.type === "SHIPPING" && a.isActive !== false,
  );
}

function formatAddress(address?: CustomerAddress | null) {
  if (!address) return { first: "", rest: "" };
  const first = clean(address.addressLine1);
  const rest =
    [
      clean(address.addressLine2),
      clean(address.landmark),
      clean(address.city),
      clean(address.state),
      clean(address.country),
    ]
      .filter(Boolean)
      .join(", ") +
    (clean(address.pincode) ? ` - ${clean(address.pincode)}` : "");
  return { first, rest };
}

function addressLabel(address: CustomerAddress) {
  return clean(address.label) || clean(address.addressLine1) || "Address";
}

export default function BuyerInformationCard() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();
  const dispatch = useDispatch();
  const { customers, loading } = useSelector((state: any) => state.customers) as {
    customers: CustomerDetails[];
    loading: boolean;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [customerQuery, setCustomerQuery] = useState("");
  const [shipSelection, setShipSelection] = useState<string>("");

  const customerId = watch("customerId");
  const sameAsBilling = watch("sameAsBilling") ?? true;

  useEffect(() => {
    let active = true;

    const loadCustomers = async () => {
      dispatch(setLoadingAction(true));
      try {
        const data = await customersService.getCustomers();
        const list: CustomerDetails[] = Array.isArray(data)
          ? data
          : data?.customers ?? data?.data ?? [];
        if (active) dispatch(setCustomersAction(list as never));
      } catch (error) {
        console.error("Failed to load customers:", error);
        if (active) dispatch(setErrorAction("Failed to load customers"));
      } finally {
        if (active) dispatch(setLoadingAction(false));
      }
    };

    loadCustomers();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const matchingCustomers = useMemo(() => {
    const query = customerQuery.trim().toLowerCase();
    const list = customers ?? [];
    if (!query) return list;
    return list.filter((customer) =>
      [customer.name, customer.companyName, customer.mobile, customer.email]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query)),
    );
  }, [customerQuery, customers]);

  const selectedCustomer = (customers ?? []).find(
    (customer) => customer.id === customerId,
  );
  const billingAddress = getAddressByType(selectedCustomer, "BILLING");
  const shippingAddresses = getShippingAddresses(selectedCustomer);

  const applyCustomer = (customer: CustomerDetails) => {
    const billing = getAddressByType(customer, "BILLING");
    const shipping = getShippingAddresses(customer)[0] ?? billing;

    const stateCode = getStateCode(billing?.state, billing?.stateCode);

    const values: Partial<InvoiceFormValues> = {
      customerId: customer.id,
      buyerName: clean(customer.name),
      buyerCompanyName: clean(customer.companyName),
      buyerContactPerson:
        clean(billing?.contactPerson) || clean(customer.name),
      buyerPhone: clean(billing?.contactNumber) || clean(customer.mobile),
      buyerGSTIN: clean(customer.gstin) || clean(customer.pan),
      billingAddressLine1: billing?.addressLine1 ?? "",
      billingAddressLine2: billing?.addressLine2 ?? "",
      billingCity: billing?.city ?? "",
      billingState: billing?.state ?? "",
      billingStateCode: stateCode,
      billingPincode: billing?.pincode ?? "",
      billingCountry: billing?.country ?? "India",
      placeOfSupply: clean(billing?.state),
      placeOfSupplyCode: stateCode,
    };

    if (sameAsBilling) {
      values.shippingAddressLine1 = values.billingAddressLine1;
      values.shippingAddressLine2 = values.billingAddressLine2;
      values.shippingCity = values.billingCity;
      values.shippingState = values.billingState;
      values.shippingStateCode = stateCode;
      values.shippingPincode = values.billingPincode;
      values.shippingCountry = values.billingCountry;
      setShipSelection("billing");
    } else if (shipping) {
      const shipCode = getStateCode(shipping.state, shipping.stateCode);
      values.shippingAddressLine1 = shipping.addressLine1 ?? "";
      values.shippingAddressLine2 = shipping.addressLine2 ?? "";
      values.shippingCity = shipping.city ?? "";
      values.shippingState = shipping.state ?? "";
      values.shippingStateCode = shipCode;
      values.shippingPincode = shipping.pincode ?? "";
      values.shippingCountry = shipping.country ?? "";
      setShipSelection(shipping.id ?? "");
    }

    Object.entries(values).forEach(([name, value]) => {
      setValue(name as keyof InvoiceFormValues, value as never, {
        shouldDirty: true,
        shouldValidate: true,
      });
    });

    dispatch(setSelectedCustomerAction(customer as never));
  };

  const applyNewCustomer = (customer: CustomerDetails) => {
    applyCustomer(customer);
    dispatch(
      setCustomersAction([
        customer,
        ...(customers ?? []).filter((c) => c.id !== customer.id),
      ] as never),
    );
  };

  const selectCustomer = async (customer: CustomerDetails) => {
    setIsSelecting(true);
    try {
      applyCustomer(customer);
    } finally {
      setIsSelecting(false);
      setIsOpen(false);
      setCustomerQuery("");
    }
  };

  const clearCustomer = () => {
    setValue("customerId", "", { shouldDirty: true, shouldValidate: true });
    dispatch(setSelectedCustomerAction(null as never));
  };

  const msLabel = selectedCustomer
    ? [
        selectedCustomer.companyName,
        selectedCustomer.gstin,
        selectedCustomer.name,
        billingAddress?.addressLine1,
      ]
        .map(clean)
        .filter(Boolean)
        .join(", ")
    : "";

  const resolvedShipTo: CustomerAddress | null =
    shipSelection === "billing"
      ? billingAddress
      : shippingAddresses.find((a) => a.id === shipSelection) ?? null;
  const shipAddress = formatAddress(resolvedShipTo);
  const billingDisplay = formatAddress(billingAddress);

  return (
    <section className="min-w-0">
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-600">
            <UserRound className="size-4" />
          </span>
          <h2 className="min-w-0 truncate text-sm font-semibold text-gray-900">
            Customer Information
          </h2>
        </div>

        <CustomerQuickCreateDrawer onCreated={applyNewCustomer}>
          <Button type="button" variant="outline" size="sm" className="gap-1.5">
            <Plus className="size-4" />
            Add Customer
          </Button>
        </CustomerQuickCreateDrawer>
      </div>

      <div className="divide-y divide-gray-100">
        {/* M/S. */}
        <Row label="M/S." required>
          <div className="flex min-w-0 items-center gap-2">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={isOpen}
                  className="h-10 min-w-0 flex-1 justify-between font-normal"
                >
                  <span className="min-w-0 flex-1 truncate text-left">
                    {msLabel ||
                      (loading
                        ? "Loading customers..."
                        : "Search or select customer")}
                  </span>
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="w-[var(--radix-dropdown-menu-trigger-width)] p-2"
              >
                <div className="relative mb-2">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    autoFocus
                    value={customerQuery}
                    onChange={(e) => setCustomerQuery(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    placeholder="Search customers..."
                    className="pl-9"
                  />
                </div>

                <div className="max-h-[200px] overflow-y-auto pr-1">
                  {loading || isSelecting ? (
                    <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      {isSelecting
                        ? "Loading customer details..."
                        : "Loading customers..."}
                    </div>
                  ) : matchingCustomers.length ? (
                    matchingCustomers.map((customer) => (
                      <DropdownMenuItem
                        key={customer.id}
                        onSelect={(e) => {
                          e.preventDefault();
                          void selectCustomer(customer);
                        }}
                        className="flex-col items-start gap-0.5 px-3 py-2.5"
                      >
                        <span className="flex w-full items-center gap-2 font-medium text-gray-900">
                          {customer.name}
                          {customerId === customer.id && (
                            <Check className="ml-auto size-4 text-primary" />
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {[
                            customer.companyName,
                            customer.mobile,
                            customer.email,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="px-3 py-3 text-sm text-muted-foreground">
                      No customers found.
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedCustomer && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearCustomer}
                className="h-10 w-10 shrink-0 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                aria-label="Clear customer"
                title="Clear customer"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
          <FormError message={errors.customerId?.message} />
        </Row>

        {/* Customer Type */}
        <Row label="Customer Type">
          <div className="flex h-10 items-center gap-2 rounded-md bg-gray-50 px-3 text-sm text-gray-700">
            <Tag className="size-4 shrink-0 text-muted-foreground" />
            {formatCustomerType(selectedCustomer?.customerType)}
          </div>
        </Row>

        {/* Address */}
        <Row label="Address">
          <Textarea
            readOnly
            value={
              billingDisplay.first
                ? `${billingDisplay.first}\n${billingDisplay.rest}`
                : ""
            }
            className="min-h-[64px] resize-none bg-gray-50 text-sm text-gray-700"
          />
        </Row>

        <Row label="Contact Person">
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register("buyerContactPerson")}
              placeholder="Contact Person"
              className="pl-9"
            />
          </div>
          <FormError message={errors.buyerContactPerson?.message} />
        </Row>

        <Row label="Phone No">
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="tel"
              inputMode="numeric"
              maxLength={15}
              placeholder="Phone No"
              className="pl-9"
              {...register("buyerPhone", {
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/[^\d+ ]/g, "");
                },
              })}
            />
          </div>
          <FormError message={errors.buyerPhone?.message} />
        </Row>

        <Row label="GSTIN / PAN">
          <div className="relative">
            <Fingerprint className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input {...register("buyerGSTIN")} className="pl-9" />
          </div>
          <FormError message={errors.buyerGSTIN?.message} />
        </Row>

        {/* Ship To */}
        <Row label="Ship To">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full justify-between font-normal"
              >
                <span className="flex items-center gap-2 truncate">
                  <Truck className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">
                    {shipSelection === "billing"
                      ? billingAddress
                        ? addressLabel(billingAddress)
                        : "Same as billing address"
                      : resolvedShipTo
                        ? addressLabel(resolvedShipTo)
                        : "--"}
                  </span>
                </span>
                <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[var(--radix-dropdown-menu-trigger-width)]"
            >
              <DropdownMenuItem
                onSelect={() => {
                  setShipSelection("");
                  setValue("shippingAddressLine1", "", { shouldDirty: true });
                  setValue("shippingAddressLine2", "", { shouldDirty: true });
                  setValue("shippingCity", "", { shouldDirty: true });
                  setValue("shippingState", "", { shouldDirty: true });
                  setValue("shippingStateCode", "", { shouldDirty: true });
                  setValue("shippingPincode", "", { shouldDirty: true });
                  setValue("shippingCountry", "", { shouldDirty: true });
                }}
              >
                --
              </DropdownMenuItem>
              {billingAddress && (
                <DropdownMenuItem
                  onSelect={() => {
                    setShipSelection("billing");
                    const code = getStateCode(
                      billingAddress.state,
                      billingAddress.stateCode,
                    );
                    setValue(
                      "shippingAddressLine1",
                      billingAddress.addressLine1 ?? "",
                      { shouldDirty: true },
                    );
                    setValue(
                      "shippingAddressLine2",
                      billingAddress.addressLine2 ?? "",
                      { shouldDirty: true },
                    );
                    setValue("shippingCity", billingAddress.city ?? "", {
                      shouldDirty: true,
                    });
                    setValue("shippingState", billingAddress.state ?? "", {
                      shouldDirty: true,
                    });
                    setValue("shippingStateCode", code, { shouldDirty: true });
                    setValue(
                      "shippingPincode",
                      billingAddress.pincode ?? "",
                      { shouldDirty: true },
                    );
                    setValue(
                      "shippingCountry",
                      billingAddress.country ?? "",
                      { shouldDirty: true },
                    );
                  }}
                >
                  Same as billing — {addressLabel(billingAddress)}
                </DropdownMenuItem>
              )}
              {shippingAddresses.map((address) => (
                <DropdownMenuItem
                  key={address.id}
                  onSelect={() => {
                    setShipSelection(address.id);
                    const code = getStateCode(address.state, address.stateCode);
                    setValue(
                      "shippingAddressLine1",
                      address.addressLine1 ?? "",
                      { shouldDirty: true },
                    );
                    setValue(
                      "shippingAddressLine2",
                      address.addressLine2 ?? "",
                      { shouldDirty: true },
                    );
                    setValue("shippingCity", address.city ?? "", {
                      shouldDirty: true,
                    });
                    setValue("shippingState", address.state ?? "", {
                      shouldDirty: true,
                    });
                    setValue("shippingStateCode", code, { shouldDirty: true });
                    setValue("shippingPincode", address.pincode ?? "", {
                      shouldDirty: true,
                    });
                    setValue("shippingCountry", address.country ?? "", {
                      shouldDirty: true,
                    });
                  }}
                >
                  {addressLabel(address)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {resolvedShipTo && shipAddress.first && (
            <div className="mt-2 rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700">
              <p>{shipAddress.first}</p>
              <p>{shipAddress.rest}</p>
            </div>
          )}
        </Row>

        <Row label="Place of Supply" required>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register("placeOfSupply")}
              placeholder="State or union territory"
              className="pl-9"
            />
          </div>
          <FormError message={errors.placeOfSupply?.message} />
        </Row>
      </div>
    </section>
  );
}

function FormError({ message }: { message?: string }) {
  return message ? (
    <p className="mt-1 text-xs text-red-600">{message}</p>
  ) : null;
}

function Row({
  label,
  children,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-1.5 py-3 sm:grid-cols-[130px_1fr] sm:gap-4">
      <Label className="text-sm text-gray-700 sm:pt-2.5">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>
      <div className="min-w-0">{children}</div>
    </div>
  );
}