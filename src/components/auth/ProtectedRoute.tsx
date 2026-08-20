"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useAppDispatch,
  useAppSelector,
} from "@/store/hooks";

import {
  loadRoleAccess,
  loadRolePermissions,
  setSelectedRoleId,
} from "@/modules/roleAccess/store/roleAccessSlice";

import { hasAccessToRoute } from "@/modules/roleAccess/utils/access";

/* ==================================================
 * PUBLIC ROUTES
 * ================================================== */

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/verify-otp",
  "/create-password",
];

/* ==================================================
 * PROTECTED ROUTE
 * ================================================== */

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  /* ==================================================
   * AUTH STATE
   * ================================================== */

  const {
    user,
    isAuthenticated,
    loading: authLoading,
    initialized: authInitialized,
  } = useAppSelector(
    (state) => state.auth
  );

  /* ==================================================
   * ROLE ACCESS STATE
   * ================================================== */

  const {
    accessTree,
    permissions,
    permissionsLoaded,
    isLoading: permissionsLoading,
  } = useAppSelector(
    (state) => state.roleAccess
  );

  /* ==================================================
   * PUBLIC ROUTE
   * ================================================== */

  const isPublicRoute = useMemo(() => {
    if (!pathname) {
      return false;
    }

    return PUBLIC_ROUTES.some(
      (route) =>
        pathname === route ||
        pathname.startsWith(`${route}/`)
    );
  }, [pathname]);

  /* ==================================================
   * SUPER ADMIN
   * ==================================================
  */

  const isSuperAdmin = useMemo(() => {
    const role = String(
      user?.role ?? ""
    )
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

    return role === "superadmin";
  }, [user?.role]);

  /* ==================================================
   * PERMISSION INITIALIZATION REF
   * ==================================================
   *
   * This is the important part for preventing:
   *
   * getAllRoles()
   * getAllRoles()
   * getAllRoles()
   * getAllRoles()
   *
   * repeatedly.
   * ================================================== */

  const permissionsInitialized =
    useRef(false);

  /* ==================================================
   * RESET PERMISSION INITIALIZATION
   *
   * When user logs out, allow the next login to
   * initialize permissions again.
   * ================================================== */

  useEffect(() => {
    if (!isAuthenticated) {
      permissionsInitialized.current =
        false;
    }
  }, [isAuthenticated]);

  /* ==================================================
   * LOAD ROLE PERMISSIONS
   * ================================================== */

  useEffect(() => {
    /*
     * No pathname.
     */
    if (!pathname) {
      return;
    }

    /*
     * Public pages don't need permissions.
     */
    if (isPublicRoute) {
      return;
    }

    /*
     * Authentication is still being restored.
     */
    if (
      !authInitialized ||
      authLoading
    ) {
      return;
    }

    /*
     * User is not authenticated.
     */
    if (
      !isAuthenticated ||
      !user?.id
    ) {
      return;
    }

    /*
     * Super Admin has complete access.
     *
     * IMPORTANT:
     *
     * We do NOT call getAllRoles()
     * for Super Admin.
     */
    if (isSuperAdmin) {
      return;
    }

    /*
     * Already initialized.
     *
     * This prevents the effect from calling
     * getAllRoles() repeatedly when Redux state
     * changes.
     */
    if (
      permissionsInitialized.current
    ) {
      return;
    }

    /*
     * Mark initialization as started
     * BEFORE making the API request.
     */
    permissionsInitialized.current =
      true;

    let cancelled = false;

    const loadPermissions =
      async () => {
        try {
          /*
           * ------------------------------------------
           * LOAD ROLES
           * ------------------------------------------
           */

          const result =
            await dispatch(
              loadRoleAccess()
            ).unwrap();

          if (cancelled) {
            return;
          }

          const roles =
            result?.roles ?? [];

          /*
           * ------------------------------------------
           * NORMALIZE USER ROLE
           * ------------------------------------------
           */

          const userRole = String(
            user?.role ?? ""
          )
            .trim()
            .toLowerCase();

          /*
           * ------------------------------------------
           * FIND USER ROLE
           * ------------------------------------------
           */

          const matchedRole =
            roles.find(
              (role: any) => {
                const roleName =
                  String(
                    role?.name ?? ""
                  )
                    .trim()
                    .toLowerCase();

                return (
                  roleName === userRole
                );
              }
            );

          /*
           * ------------------------------------------
           * ROLE NOT FOUND
           * ------------------------------------------
           */

          if (!matchedRole?.id) {
            console.warn(
              "[ProtectedRoute] Could not find role:",
              user?.role
            );

            /*
             * Allow retry if role was not found.
             */
            permissionsInitialized.current =
              false;

            return;
          }

          /*
           * ------------------------------------------
           * ROLE ID
           * ------------------------------------------
           */

          const roleId =
            String(
              matchedRole.id
            );

          /*
           * ------------------------------------------
           * STORE SELECTED ROLE
           * ------------------------------------------
           */

          dispatch(
            setSelectedRoleId(
              roleId
            )
          );

          /*
           * ------------------------------------------
           * LOAD PERMISSIONS
           * ------------------------------------------
           */

          await dispatch(
            loadRolePermissions(
              roleId
            )
          ).unwrap();

          if (cancelled) {
            return;
          }

        } catch (error) {
          if (!cancelled) {
            console.error(
              "[ProtectedRoute] Permission loading failed:",
              error
            );

            /*
             * Allow retry after failure.
             */
            permissionsInitialized.current =
              false;
          }
        }
      };

    loadPermissions();

    /*
     * Cleanup.
     */
    return () => {
      cancelled = true;
    };
  }, [
    pathname,
    isPublicRoute,
    authInitialized,
    authLoading,
    isAuthenticated,
    user?.id,
    user?.role,
    isSuperAdmin,
    dispatch,
  ]);

  /* ==================================================
 * REDIRECT AUTHENTICATION USERS
 * ================================================== */

  useEffect(() => {
    if (!pathname) {
      return;
    }

    /*
     * IMPORTANT:
     *
     * Wait until authentication restoration
     * is completely finished.
     */
    if (
      !authInitialized ||
      authLoading
    ) {
      return;
    }

    /* ==================================================
     * AUTHENTICATED USER
     * ================================================== */

    if (isAuthenticated) {
      /*
       * User is already logged in.
       *
       * Don't allow them to visit:
       * /login
       * /register
       * /forgot-password
       * /verify-otp
       * /create-password
       */
      if (isPublicRoute) {
        router.replace("/dashboard");
      }

      return;
    }

    /* ==================================================
     * UNAUTHENTICATED USER
     * ================================================== */

    /*
     * Public routes are allowed for
     * unauthenticated users.
     */
    if (isPublicRoute) {
      return;
    }

    /*
     * User is not authenticated and is trying
     * to access a protected route.
     */

    router.replace("/login");
  }, [
      pathname,
      isPublicRoute,
      authInitialized,
      authLoading,
      isAuthenticated,
      router,
  ]);

  /* ==================================================
   * CHECK ROUTE ACCESS
   * ================================================== */

  const canAccessRoute =
    useMemo(() => {
      /*
       * No pathname.
       */
      if (!pathname) {
        return true;
      }

      /*
       * Public route.
       */
      if (isPublicRoute) {
        return true;
      }

      /*
       * Authentication is still initializing.
       */
      if (
        !authInitialized ||
        authLoading
      ) {
        return true;
      }

      /*
       * Not authenticated.
       */
      if (!isAuthenticated) {
        return false;
      }

      /*
       * Super Admin has complete access.
       */
      if (isSuperAdmin) {
        return true;
      }

      /*
       * Permissions are still loading.
       */
      if (pathname === "/dashboard") {
        return true;
      }

      if (
        permissionsLoading ||
        !permissionsLoaded
      ) {
        return true;
      }

      /*
       * No access tree.
       *
       * Don't accidentally block the entire app.
       */
      if (
        !accessTree ||
        accessTree.length === 0
      ) {
        return true;
      }

      /*
       * Check actual route access.
       */
      return hasAccessToRoute(
        accessTree,
        pathname,
        permissions,
        user?.role
      );
    }, [
      pathname,
      isPublicRoute,
      authInitialized,
      authLoading,
      isAuthenticated,
      isSuperAdmin,
      permissionsLoading,
      permissionsLoaded,
      accessTree,
      permissions,
      user?.role,
    ]);

  /* ==================================================
   * REDIRECT UNAUTHORIZED USER
   * ================================================== */

  useEffect(() => {
    if (!pathname) {
      return;
    }

    /*
     * Public route.
     */
    if (isPublicRoute) {
      return;
    }

    /*
     * Auth isn't ready.
     */
    if (
      !authInitialized ||
      authLoading
    ) {
      return;
    }

    /*
     * Not authenticated.
     *
     * The authentication effect handles this.
     */
    if (!isAuthenticated) {
      return;
    }

    /*
     * Super Admin always has access.
     */
    if (isSuperAdmin) {
      return;
    }

    /*
     * Permissions aren't ready.
     */
    if (
      permissionsLoading ||
      !permissionsLoaded
    ) {
      return;
    }

    /*
     * No access.
     */
    if (!canAccessRoute) {
      console.warn(
        "[ProtectedRoute] Access denied:",
        pathname
      );

      /*
       * Don't redirect if already on dashboard.
       */
      if (
        pathname !== "/dashboard"
      ) {
        router.replace(
          "/dashboard"
        );
      }
    }
  }, [
    pathname,
    isPublicRoute,
    authInitialized,
    authLoading,
    isAuthenticated,
    isSuperAdmin,
    permissionsLoading,
    permissionsLoaded,
    canAccessRoute,
    router,
  ]);

  /* ==================================================
   * RENDER
   * ================================================== */

  /*
   * ------------------------------------------
   * PUBLIC ROUTE
   * ------------------------------------------
   */

  if (isPublicRoute) {
    return <>{children}</>;
  }

  /*
   * ------------------------------------------
   * AUTH INITIALIZATION
   * ------------------------------------------
   */

  if (
    !authInitialized ||
    authLoading
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  /*
   * ------------------------------------------
   * NOT AUTHENTICATED
   * ------------------------------------------
   */

  if (!isAuthenticated) {
    return null;
  }

  /*
   * ------------------------------------------
   * SUPER ADMIN
   * ------------------------------------------
   *
   * Don't wait for permissions.
   */

  if (isSuperAdmin) {
    return <>{children}</>;
  }

  /*
   * ------------------------------------------
   * PERMISSIONS LOADING
   * ------------------------------------------
   */

  if (
    permissionsLoading ||
    !permissionsLoaded
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading permissions...
      </div>
    );
  }

  /*
   * ------------------------------------------
   * UNAUTHORIZED
   * ------------------------------------------
   */

  if (!canAccessRoute) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold">
            Access Denied
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            You don't have permission to access:
          </p>

          <p className="mt-1 font-mono text-sm">
            {pathname}
          </p>
        </div>
      </div>
    );
  }

  /*
   * ------------------------------------------
   * AUTHENTICATED + AUTHORIZED
   * ------------------------------------------
   */

  return <>{children}</>;
}