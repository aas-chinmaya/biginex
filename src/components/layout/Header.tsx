"use client";

import { Menu, Search, X, Building2 } from "lucide-react";

import { Button, Input } from "@/components/ui";

import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";

interface HeaderProps {
  sidebarOpen: boolean;
  onMenuClick: () => void;
}

export default function Header({
  sidebarOpen,
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left Section */}
        <div className="flex items-center gap-6">

          {/* Business Name */}
          <div className="hidden items-center gap-3 md:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Building2
                size={22}
                className="text-primary"
              />
            </div>

            <div className="leading-tight">
              <p className="text-sm font-semibold text-gray-900">
                ABC Corporation Pvt Ltd
              </p>
              <p className="text-xs text-gray-500">
                Business Account
              </p>
            </div>
          </div>


          {/* Search */}
          <div className="flex flex-1 items-center">
            <div className="relative w-full">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <Input
                placeholder="Search items, customers, invoices..."
                className="pl-10"
              />
            </div>
          </div>

        </div>


        {/* Right */}
        <div className="ml-6 flex items-center gap-2">

          <NotificationBell />

          <UserMenu />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
            aria-label={
              sidebarOpen ? "Close Sidebar" : "Open Sidebar"
            }
          >
            {sidebarOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </Button>

        </div>

      </div>
    </header>
  );
}