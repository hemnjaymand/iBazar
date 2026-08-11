"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { StockAdjustmentDialog } from "./stock-adjustment-dialog";
import type { InventoryRowDTO } from "../types/stock-movement.dto";

const columnHelper = createColumnHelper<InventoryRowDTO>();

const columns = [
  columnHelper.accessor("productName", { header: "محصول" }),
  columnHelper.accessor("sku", {
    header: "SKU",
    cell: (info) => <span className="num">{info.getValue()}</span>,
  }),
  columnHelper.accessor("stock", {
    header: "موجودی",
    cell: (info) => (
      <span className="num">{info.getValue().toLocaleString("fa-IR")}</span>
    ),
  }),
  columnHelper.accessor("isLowStock", {
    header: "وضعیت",
    cell: (info) =>
      info.getValue() ? (
        <Badge variant="discount">موجودی کم</Badge>
      ) : (
        <Badge variant="new">عادی</Badge>
      ),
  }),
];

export function InventoryTable({ rows }: { rows: InventoryRowDTO[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<InventoryRowDTO | null>(null);
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-muted)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-right px-4 py-2.5 font-medium"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
                <th className="px-4 py-2.5 font-medium">عملیات</th>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-[var(--color-border)]"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="px-4 py-2.5">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelected(row.original)}
                    >
                      اصلاح موجودی
                    </Button>
                    <Link href={`/admin/inventory/${row.original.variantId}`}>
                      <Button size="sm" variant="ghost">
                        تاریخچه
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <StockAdjustmentDialog
          variantId={selected.variantId}
          currentStock={selected.stock}
          onClose={() => setSelected(null)}
          onSuccess={() => {
            setSelected(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
