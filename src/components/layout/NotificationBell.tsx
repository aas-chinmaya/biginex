"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Package,
  ShoppingCart,
  AlertTriangle,
} from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  icon: React.ReactNode;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "Low Stock",
    message: "Apple iPhone 15 has only 3 items left.",
    time: "2 min ago",
    unread: true,
    icon: <Package className="h-4 w-4 text-orange-500" />,
  },
  {
    id: 2,
    title: "New Sale",
    message: "Invoice INV-10025 created successfully.",
    time: "10 min ago",
    unread: true,
    icon: <ShoppingCart className="h-4 w-4 text-green-600" />,
  },
  {
    id: 3,
    title: "Payment Due",
    message: "Supplier payment is due tomorrow.",
    time: "1 hour ago",
    unread: false,
    icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
  },
];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  const [notifications, setNotifications] =
    useState(initialNotifications);

  const unreadCount = notifications.filter(
    (item) => item.unread
  ).length;

  function markAllAsRead() {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        unread: false,
      }))
    );
  }

  return (
    <div className="relative">
      {/* Bell */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-lg p-2 transition hover:bg-gray-100"
      >
        <Bell className="h-5 w-5 text-gray-700" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-96 overflow-hidden rounded-xl border bg-white shadow-xl">

          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="font-semibold">
              Notifications
            </h3>

            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 text-sm text-[var(--color-primary)] transition hover:opacity-80"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`flex cursor-pointer gap-3 border-b p-4 transition hover:bg-gray-50 ${
                    item.unread
                      ? "bg-[color:rgba(0,53,102,0.05)]"
                      : ""
                  }`}
                >
                  <div className="mt-1">
                    {item.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        {item.title}
                      </h4>

                      {item.unread && (
                        <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                      )}
                    </div>

                    <p className="mt-1 text-sm text-gray-600">
                      {item.message}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-3">
            <Link
              href="/notifications"
              className="block rounded-lg py-2 text-center text-sm font-medium text-[var(--color-primary)] transition hover:bg-[color:rgba(0,53,102,0.08)]"
            >
              View All Notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}