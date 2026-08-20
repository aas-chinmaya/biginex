"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { sidebarItems } from "@/config/sidebar";
import { cn } from "@/components/ui/utils";
import { useAppSelector } from "@/store/hooks";
import { filterSidebarItems } from "@/modules/roleAccess/utils/access";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({
  open,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const { accessTree, permissions, user } = useAppSelector((state) => ({
    accessTree: state.roleAccess.accessTree,
    permissions: state.roleAccess.permissions,
    user: state.auth.user,
  }));

  const visibleSidebarItems = useMemo(
    () => filterSidebarItems(sidebarItems, accessTree, permissions, user?.role),
    [accessTree, permissions, user?.role],
  );

  // console.log("dfgdfhf",user)

  const [openMenus, setOpenMenus] = useState<
    Record<string, boolean>
  >({});

  // Automatically expand the parent menu of the active page
  useEffect(() => {
    const expanded: Record<string, boolean> = {};

    visibleSidebarItems.forEach((item) => {
      if (
        item.children?.some((child) =>
          pathname.startsWith(child.href)
        )
      ) {
        expanded[item.title] = true;
      }
    });

    setOpenMenus(expanded);
  }, [pathname, visibleSidebarItems]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-dvh w-72 flex-col",
        "border-r bg-white",
        "transition-transform duration-300 ease-in-out",
        "lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo */}
      <div className="border-b p-4">
        <h1 className="text-2xl font-bold text-primary">
          Biznex
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        {visibleSidebarItems.map((item) => {
          const Icon = item.icon;

          const hasChildren =
            item.children &&
            item.children.length > 0;

          const isOpen =
            openMenus[item.title];

          const parentActive =
            item.href
              ? pathname.startsWith(item.href)
              : item.children?.some((child) =>
                pathname.startsWith(child.href)
              );

          return (
            <div
              key={item.title}
              className="mx-3 mb-1"
            >
              {/* Parent */}
              {hasChildren ? (
                <>
                  <button
                    onClick={() =>
                      toggleMenu(item.title)
                    }
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-4 py-3 transition-all duration-200",

                      parentActive
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} />

                      <span className="font-medium">
                        {item.title}
                      </span>
                    </div>

                    <ChevronRight
                      size={18}
                      className={cn(
                        "transition-transform duration-300",
                        isOpen && "rotate-90"
                      )}
                    />
                  </button>

                  {/* Children */}
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      isOpen
                        ? "max-h-[600px] opacity-100"
                        : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="ml-6 mt-2 space-y-1 border-l border-gray-200 pl-4">
                      {item.children?.map((child) => {
                        const ChildIcon = child.icon;

                        const active = pathname === child.href;

                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={onClose}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",

                              active
                                ? "bg-primary/10 text-primary"
                                : "text-gray-600 hover:bg-primary/10 hover:text-primary"
                            )}
                          >
                            {ChildIcon && (
                              <ChildIcon
                                size={16}
                                className="shrink-0"
                              />
                            )}

                            <span className="flex-1">
                              {child.title}
                            </span>

                            {child.badge && (
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-xs font-medium",
                                  active
                                    ? "bg-primary text-white"
                                    : "bg-primary/10 text-primary"
                                )}
                              >
                                {child.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={item.href!}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-4 py-3 transition-all duration-200",

                    parentActive
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />

                    <span className="font-medium">
                      {item.title}
                    </span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-xs font-medium",

                        parentActive
                          ? "bg-white text-primary"
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4 text-center text-xs text-gray-500">
        Biznex ERP v1.0
      </div>
    </aside>
  );
}