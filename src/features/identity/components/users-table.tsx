"use client";

import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { updateUserAdminAction } from "../actions/user-mutation.actions";
import { UserRoleBadge } from "./user-role-badge";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import type { UserAdminRowDTO } from "../types/user-admin-row.dto";
import { toast } from "@/shared/lib/toast";

const columnHelper = createColumnHelper<UserAdminRowDTO>();

const columns = [
  columnHelper.accessor("name", { header: "نام", cell: (info) => info.getValue() ?? "—" }),
  columnHelper.accessor("email", { header: "ایمیل", cell: (info) => <span dir="ltr">{info.getValue()}</span> }),
  columnHelper.accessor("role", { header: "نقش", cell: (info) => <UserRoleBadge role={info.getValue()} /> }),
  columnHelper.accessor("isActive", {
    header: "وضعیت",
    cell: (info) => (info.getValue() ? <Badge variant="new">فعال</Badge> : <Badge variant="outOfStock">غیرفعال</Badge>),
  }),
  columnHelper.accessor("createdAt", {
    header: "تاریخ عضویت",
    cell: (info) => <span className="num">{new Date(info.getValue()).toLocaleDateString("fa-IR")}</span>,
  }),
];

export function UsersTable({ users }: { users: UserAdminRowDTO[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const currentUserId = (session?.user as { id?: string } | undefined)?.id;

  const table = useReactTable({ data: users, columns, getCoreRowModel: getCoreRowModel() });

  async function handleToggleRole(user: UserAdminRowDTO) {
    const newRole = user.role === "ADMIN" ? "CUSTOMER" : "ADMIN";
    const result = await updateUserAdminAction({ id: user.id, role: newRole });
    if (!result.success) {
      toast.error(result.error.message);
      return;
    }
    toast.success(`نقش کاربر به ${newRole === "ADMIN" ? "ادمین" : "مشتری"} تغییر کرد`);
    router.refresh();
  }

  async function handleToggleActive(user: UserAdminRowDTO) {
    const result = await updateUserAdminAction({ id: user.id, isActive: !user.isActive });
    if (!result.success) {
      toast.error(result.error.message);
      return;
    }
    toast.success(user.isActive ? "کاربر غیرفعال شد" : "کاربر فعال شد");
    router.refresh();
  }

  return (
    <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--color-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--color-muted)]">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="text-right px-4 py-2.5 font-medium">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
              <th className="px-4 py-2.5 font-medium">عملیات</th>
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const isSelf = row.original.id === currentUserId;
            return (
              <tr key={row.id} className="border-t border-[var(--color-border)]">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="px-4 py-2.5">
                  {isSelf ? (
                    <span className="text-xs text-[var(--color-muted-foreground)]">حساب خودتان</span>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleToggleRole(row.original)}>
                        {row.original.role === "ADMIN" ? "تنزل به مشتری" : "ارتقا به ادمین"}
                      </Button>
                      <Button
                        size="sm"
                        variant={row.original.isActive ? "destructive" : "outline"}
                        onClick={() => handleToggleActive(row.original)}
                      >
                        {row.original.isActive ? "غیرفعال کردن" : "فعال کردن"}
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
          {users.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-6 text-[var(--color-muted-foreground)]">کاربری ثبت نشده است</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}