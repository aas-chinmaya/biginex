"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { notify } from "@/lib/toast";
import { useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/modules/auth/store/authSlice";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export default function UserMenu() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const displayName = user?.fullName || user?.name || "Admin";
  const displayEmail = user?.email || "admin@biznex.com";
  const displayRole = user?.role || "Administrator";

  async function handleLogout() {
    const result = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(result)) {
      router.replace("/login");
      return;
    }

    notify.error(result.payload || "Logout failed");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-11 gap-3 rounded-xl px-2"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src="/images/user.jpg" />

            <AvatarFallback>
              AD
            </AvatarFallback>
          </Avatar>

          <div className="hidden text-left lg:block">
            <p className="text-sm font-semibold text-gray-900">
              {displayName}
            </p>

            <p className="text-xs text-gray-500">
              {displayRole}
            </p>
          </div>

          <ChevronDown className="hidden h-4 w-4 text-gray-500 lg:block" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-60"
      >
        <DropdownMenuLabel>
          <p className="font-semibold">
            {displayName}
          </p>

          <p className="text-xs font-normal text-gray-500">
            {displayEmail}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}