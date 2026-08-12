"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { toast } from "@/shared/lib/toast";

import type { BrandResponseDTO } from "../types/brand.dto";
import { BrandFormDialog } from "./brand-form-dialog";

const columnHelper = createColumnHelper<BrandResponseDTO>();

const columns = [
  columnHelper.accessor("name", {
    header: "برند",
    cell: (info) => {
      const brand = info.row.original;

      return (
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]">
            {brand.logoUrl ? (
              <Image
                src={brand.logoUrl}
                alt={brand.name}
                fill
                sizes="40px"
                className="object-contain p-1"
              />
            ) : (
              <span className="text-sm font-semibold text-[var(--color-muted-foreground)]">
                {brand.name.charAt(0)}
              </span>
            )}
          </div>

          <span className="font-medium text-[var(--color-foreground)]">
            {brand.name}
          </span>
        </div>
      );
    },
  }),

  columnHelper.accessor("slug", {
    header: "Slug",
    cell: (info) => (
      <span className="num" dir="ltr">
        {info.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor("isActive", {
    header: "وضعیت",
    cell: (info) =>
      info.getValue() ? (
        <Badge variant="new">فعال</Badge>
      ) : (
        <Badge variant="outOfStock">غیرفعال</Badge>
      ),
  }),
];

export function BrandsTable({
  brands,
}: {
  brands: BrandResponseDTO[];
}) {
  const router = useRouter();

  const [dialogState, setDialogState] = useState<
    "create" | BrandResponseDTO | null
  >(null);

  const table = useReactTable({
    data: brands,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          size="sm"
          onClick={() => setDialogState("create")}
        >
          + برند جدید
        </Button>
      </div>

      <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)]">
        <table className="w-full min-w-[650px] text-sm">
          <thead className="bg-[var(--color-muted)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-[var(--color-border)]"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-right font-medium"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}

                <th className="px-4 py-3 text-right font-medium">
                  عملیات
                </th>
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-muted)]/30"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </td>
                ))}

                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setDialogState(row.original)
                    }
                  >
                    ویرایش
                  </Button>
                </td>
              </tr>
            ))}

            {brands.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-10 text-center text-[var(--color-muted-foreground)]"
                >
                  برندی ثبت نشده است
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {dialogState && (
        <BrandFormDialog
          editing={
            dialogState === "create"
              ? undefined
              : dialogState
          }
          onClose={() => setDialogState(null)}
          onSuccess={() => {
            const isCreating =
              dialogState === "create";

            setDialogState(null);

            toast.success(
              isCreating
                ? "برند ساخته شد"
                : "برند به‌روزرسانی شد",
            );

            router.refresh();
          }}
        />
      )}
    </>
  );
}