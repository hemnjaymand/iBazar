"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Button } from "@/shared/ui/button";
import { OrderStatusUpdateDialog } from "./order-status-update-dialog";
import type { OrderDTO } from "../types/order.dto";

const columnHelper = createColumnHelper<OrderDTO>();

const columns = [
  columnHelper.accessor("orderNumber", {
    header: "شماره سفارش",
    cell: (info) => <span className="num">{info.getValue()}</span>,
  }),
  columnHelper.accessor("status", { header: "وضعیت" }),
  columnHelper.accessor("total", {
    header: "مبلغ",
    cell: (info) => (
      <span className="num">
        {parseFloat(info.getValue()).toLocaleString("fa-IR")} تومان
      </span>
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: "تاریخ",
    cell: (info) => (
      <span className="num">
        {new Date(info.getValue()).toLocaleDateString("fa-IR")}
      </span>
    ),
  }),
];

export function OrdersTable({ orders }: { orders: OrderDTO[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<OrderDTO | null>(null);
  const table = useReactTable({
    data: orders,
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelected(row.original)}
                  >
                    تغییر وضعیت
                  </Button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-6 text-[var(--color-muted-foreground)]"
                >
                  سفارشی ثبت نشده است
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <OrderStatusUpdateDialog
          orderId={selected.id}
          currentStatus={selected.status}
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
