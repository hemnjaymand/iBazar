"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";

import type { BrandResponseDTO } from "../types/brand.dto";
import { BrandFormDialog } from "./brand-form-dialog";
import { toast } from "@/shared/lib/toast";

const columnHelper = createColumnHelper<BrandResponseDTO>();

const columns = [
  columnHelper.accessor("name", { header: "نام برند" }),
  columnHelper.accessor("slug", { header: "Slug", cell: (info) => <span className="num" dir="ltr">{info.getValue()}</span> }),
  columnHelper.accessor("isActive", {
    header: "وضعیت",
    cell: (info) => (info.getValue() ? <Badge variant="new">فعال</Badge> : <Badge variant="outOfStock">غیرفعال</Badge>),
  }),
];

export function BrandsTable({ brands }: { brands: BrandResponseDTO[] }) {
  const router = useRouter();
  const [dialogState, setDialogState] = useState<"create" | BrandResponseDTO | null>(null);
  const table = useReactTable({ data: brands, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setDialogState("create")}>+ برند جدید</Button>
      </div>

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
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-[var(--color-border)]">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="px-4 py-2.5">
                  <Button size="sm" variant="outline" onClick={() => setDialogState(row.original)}>
                    ویرایش
                  </Button>
                </td>
              </tr>
            ))}
            {brands.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-6 text-[var(--color-muted-foreground)]">
                  برندی ثبت نشده است
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {dialogState && (
        <BrandFormDialog
          editing={dialogState === "create" ? undefined : dialogState}
          onClose={() => setDialogState(null)}
          onSuccess={() => {
            setDialogState(null);
            toast.success(dialogState === "create" ? "برند ساخته شد" : "برند به‌روزرسانی شد");
            router.refresh();
          }}
        />
      )}
    </>
  );
}