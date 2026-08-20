"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";
import Search from "@/components/data-table/Search";
import TableToolbar from "@/components/data-table/TableToolbar";
import { DataTable } from "@/components/data-table/DataTable";
import Pagination from "@/components/data-table/Pagination";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/modules/users/store/userSlice";
import type {
  RootState,
  AppDispatch,
} from "@/store/store";
import type {
  User,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/modules/users/types";
import CreateUser from "./createUser";
import UpdateUser from "./UpdateUser";
import UserActions from "./UserActions";
import type { ColumnDef } from "@tanstack/react-table";

/* ==================================================
 * COMPONENT
 * ================================================== */

export default function AllUserPage() {
  const dispatch = useDispatch<AppDispatch>();

  /* ==================================================
   * REDUX STATE
   * ================================================== */

  const {
    users,
    isLoading,
    isSaving,
    error,
  } = useSelector(
    (state: RootState) => state.users
  );

  /* ==================================================
   * LOCAL STATE
   * ================================================== */

  const [search, setSearch] =
    useState("");

  const [createOpen, setCreateOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [page, setPage] =
    useState(1);

  const [limit] =
    useState(10);

  /* ==================================================
   * FETCH USERS
   * ================================================== */

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const result =
          await dispatch(
            fetchUsers({
              page,
              limit,
              search: search.trim(),
              all: false,
            })
          ).unwrap();
      } catch (error) {
      }
    };

    loadUsers();
  }, [
    dispatch,
    page,
    limit,
    search,
  ]);

  /* ==================================================
   * DEBUG REDUX USERS
   * ================================================== */

  useEffect(() => {
  }, [users]);

  /* ==================================================
   * CREATE USER
   * ================================================== */

  const handleCreate = async (
    payload: CreateUserPayload
  ) => {
    try {
      await dispatch(
        createUser(payload)
      ).unwrap();

      notify.success(
        "User created successfully"
      );

      setCreateOpen(false);

      /*
       * Refresh current page because
       * pagination/search may affect the list.
       */
      await dispatch(
        fetchUsers({
          page,
          limit,
          search: search.trim(),
          all: false,
        })
      ).unwrap();
    } catch (error) {

      notify.error(
        "Could not create user"
      );
    }
  };

  /* ==================================================
   * UPDATE USER
   * ================================================== */

  const handleUpdate = async (
    payload: UpdateUserPayload
  ) => {
    if (!selectedUser?.id) {
      return;
    }

    try {
      await dispatch(
        updateUser({
          userId: selectedUser.id,
          payload,
        })
      ).unwrap();

      notify.success(
        "User updated successfully"
      );

      setEditOpen(false);

      setSelectedUser(null);

      /*
       * Refresh list.
       */
      await dispatch(
        fetchUsers({
          page,
          limit,
          search: search.trim(),
          all: false,
        })
      ).unwrap();
    } catch (error) {

      notify.error(
        "Could not update user"
      );
    }
  };

  /* ==================================================
   * DELETE USER
   * ================================================== */

  const handleDelete = useCallback(
    async (
      userId: number | string
    ) => {
      try {
        await dispatch(
          deleteUser(userId)
        ).unwrap();

        notify.success(
          "User deleted successfully"
        );

        /*
         * Refresh list after deletion.
         */
        await dispatch(
          fetchUsers({
            page,
            limit,
            search: search.trim(),
            all: false,
          })
        ).unwrap();
      } catch (error) {

        notify.error(
          "Could not delete user"
        );
      }
    },
    [
      dispatch,
      page,
      limit,
      search,
    ]
  );

  /* ==================================================
   * VIEW USER
   * ================================================== */

  const handleView = useCallback(
    (user: User) => {
      setSelectedUser(user);

      setViewOpen(true);
    },
    []
  );

  /* ==================================================
   * EDIT USER
   * ================================================== */

  const handleEdit = useCallback(
    (user: User) => {
      setSelectedUser(user);

      setEditOpen(true);
    },
    []
  );

  /* ==================================================
   * TABLE COLUMNS
   * ================================================== */

  const userColumns =
    useMemo<ColumnDef<User>[]>(
      () => [
        /* ------------------------------------------
         * USER
         * ------------------------------------------ */

        {
          accessorKey: "fullName",

          header: "User",

          cell: ({ row }) => {
            const user =
              row.original;

            return (
              <div className="min-w-0">
                <p className="font-medium text-gray-900">
                  {user.fullName ||
                    "-"}
                </p>

                <p className="text-sm text-gray-500">
                  {user.email ||
                    "-"}
                </p>
              </div>
            );
          },
        },

        /* ------------------------------------------
         * CONTACT
         * ------------------------------------------ */

        {
          accessorKey: "contact",

          header: "Contact",

          cell: ({ row }) => (
            <span>
              {row.original.contact ||
                "-"}
            </span>
          ),
        },

        /* ------------------------------------------
         * ROLE
         * ------------------------------------------ */

        {
          id: "role",

          header: "Role",

          cell: ({ row }) => {
            const role =
              row.original.role;

            return (
              <span className="text-sm text-gray-700">
                {role?.name ||
                  "User"}
              </span>
            );
          },
        },

        /* ------------------------------------------
         * STATUS
         * ------------------------------------------ */

        {
          id: "status",

          header: "Status",

          cell: ({ row }) => {
            const isDeleted =
              row.original
                .isDeleted;

            return (
              <span
                className={
                  isDeleted
                    ? "font-medium text-red-600"
                    : "font-medium text-green-600"
                }
              >
                {isDeleted
                  ? "Inactive"
                  : "Active"}
              </span>
            );
          },
        },

        /* ------------------------------------------
         * ACTIONS
         * ------------------------------------------ */

        {
          id: "actions",

          header: () => (
            <div className="text-center">
              Actions
            </div>
          ),

          cell: ({ row }) => (
            <UserActions
              user={row.original}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={() =>
                handleDelete(
                  row.original.id
                )
              }
            />
          ),

          enableSorting: false,

          enableHiding: false,
        },
      ],
      [
        handleEdit,
        handleView,
        handleDelete,
      ]
    );

  /* ==================================================
   * TOTAL PAGES
   * ================================================== */

  /*
   * Your current Redux state only stores users.
   *
   * Until totalPages is stored in Redux,
   * keep pagination safe.
   *
   * If your backend returns totalPages,
   * I recommend adding it to UsersState.
   */
  const totalPages = 1;

  /* ==================================================
   * RENDER
   * ================================================== */

  return (
    <div className="space-y-6 bg-slate-50">
      {/* ==================================================
       * HEADER
       * ================================================== */}

      <div className="flex flex-col gap-4 rounded-3xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Users
          </h1>

          <p className="text-sm text-slate-500">
            Manage users, roles, and access
            from one place.
          </p>
        </div>

        <Button
          onClick={() =>
            setCreateOpen(true)
          }
          className="whitespace-nowrap"
        >
          + Add User
        </Button>
      </div>

      {/* ==================================================
       * TABLE SECTION
       * ================================================== */}

      <div className="space-y-4">
        {/* ------------------------------------------
         * TOOLBAR
         * ------------------------------------------ */}

        <TableToolbar>
          <Search
            placeholder="Search by name, email or contact"
            value={search}
            onChange={(value) => {
              setSearch(value);

              /*
               * Reset pagination when search
               * changes.
               */
              setPage(1);
            }}
          />
        </TableToolbar>

        {/* ------------------------------------------
         * ERROR
         * ------------------------------------------ */}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ------------------------------------------
         * DATA TABLE
         * ------------------------------------------ */}

        <DataTable
          columns={userColumns}
          data={users ?? []}
          loading={isLoading}
          emptyMessage={
            search
              ? "No users found for this search."
              : "No users found."
          }
        />

        {/* ------------------------------------------
         * PAGINATION
         * ------------------------------------------ */}

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(value) =>
            setPage(value)
          }
        />
      </div>

      {/* ==================================================
       * CREATE USER MODAL
       * ================================================== */}

      <CreateUser
        open={createOpen}
        onClose={() =>
          setCreateOpen(false)
        }
        onSubmit={handleCreate}
        loading={isSaving}
      />

      {/* ==================================================
       * UPDATE USER MODAL
       * ================================================== */}

      <UpdateUser
        open={editOpen}
        user={selectedUser}
        onClose={() => {
          setEditOpen(false);

          setSelectedUser(null);
        }}
        onSubmit={handleUpdate}
        loading={isSaving}
      />

      {/* ==================================================
       * VIEW USER MODAL
       * ================================================== */}

      <Modal
        open={viewOpen}
        onOpenChange={(open) => {
          if (!open) {
            setViewOpen(false);

            setSelectedUser(null);
          }
        }}
      >
        <ModalContent className="max-w-lg">
          <ModalHeader>
            <ModalTitle>
              User Details
            </ModalTitle>
          </ModalHeader>

          <ModalBody className="space-y-3 text-sm text-slate-700">
            {/* NAME */}

            <p>
              <span className="font-medium text-slate-900">
                Name:
              </span>{" "}
              {selectedUser?.fullName ||
                "-"}
            </p>

            {/* EMAIL */}

            <p>
              <span className="font-medium text-slate-900">
                Email:
              </span>{" "}
              {selectedUser?.email ||
                "-"}
            </p>

            {/* CONTACT */}

            <p>
              <span className="font-medium text-slate-900">
                Contact:
              </span>{" "}
              {selectedUser?.contact ||
                "-"}
            </p>

            {/* ROLE */}

            <p>
              <span className="font-medium text-slate-900">
                Role:
              </span>{" "}
              {selectedUser?.role
                ?.name || "-"}
            </p>

            {/* STATUS */}

            <p>
              <span className="font-medium text-slate-900">
                Status:
              </span>{" "}
              {selectedUser?.isDeleted
                ? "Inactive"
                : "Active"}
            </p>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setViewOpen(false);

                setSelectedUser(null);
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}