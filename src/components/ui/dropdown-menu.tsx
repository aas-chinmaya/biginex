"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight } from "lucide-react";

import { cn } from "./utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger =
  DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup =
  DropdownMenuPrimitive.Group;

const DropdownMenuPortal =
  DropdownMenuPrimitive.Portal;

const DropdownMenuSub =
  DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup =
  DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<
    typeof DropdownMenuPrimitive.SubTrigger
  >,
  React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.SubTrigger
  >
>(({ className, inset, children, ...props }: any, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-md px-2 py-2 text-sm outline-none hover:bg-gray-100",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}

    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));

DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<
    typeof DropdownMenuPrimitive.SubContent
  >,
  React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.SubContent
  >
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[180px] overflow-hidden rounded-lg border bg-white p-1 shadow-xl",
      className
    )}
    {...props}
  />
));

DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<
    typeof DropdownMenuPrimitive.Content
  >,
  React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.Content
  >
>(({ className, sideOffset = 6, ...props }, ref) => (
  <DropdownMenuPortal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[220px] overflow-hidden rounded-xl border bg-white p-1 shadow-xl",
        className
      )}
      {...props}
    />
  </DropdownMenuPortal>
));

DropdownMenuContent.displayName =
  DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<
    typeof DropdownMenuPrimitive.Item
  >,
  React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.Item
  > & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none transition hover:bg-gray-100 focus:bg-gray-100",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));

DropdownMenuItem.displayName =
  DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem =
  DropdownMenuPrimitive.CheckboxItem;

const DropdownMenuRadioItem =
  DropdownMenuPrimitive.RadioItem;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<
    typeof DropdownMenuPrimitive.Label
  >,
  React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.Label
  >
>(({ className, inset, ...props }: any, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-3 py-2 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));

DropdownMenuLabel.displayName =
  DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<
    typeof DropdownMenuPrimitive.Separator
  >,
  React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.Separator
  >
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn(
      "-mx-1 my-1 h-px bg-gray-200",
      className
    )}
    {...props}
  />
));

DropdownMenuSeparator.displayName =
  DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "ml-auto text-xs tracking-widest text-gray-500",
      className
    )}
    {...props}
  />
);

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};