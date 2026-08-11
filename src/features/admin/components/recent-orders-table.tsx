"use client";

import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import type { OrderSummaryDTO } from "@/features/ordering";

const columnHelper = createColumnHelper<OrderSummaryDTO>();

const columns = [
  columnHelper.accessor("orderNumber", {
    header: "شماره سفارش",
    cell: (info) => <span className="num">{info.getValue()}</span>,
  }),
  columnHelper.accessor("status", { header: "وضعیت" }),
  columnHelper.accessor("total", {
    header: "مبلغ",
    cell: (info) => <span className="num">{parseFloat(info.getValue()).toLocaleString("fa-IR")} تومان</span>,
  }),
  columnHelper.accessor("createdAt", {
    header: "تاریخ",
    cell: (info) => <span className="num">{new Date(info.getValue()).toLocaleDateString("fa-IR")}</span>,
  }),
];

export function RecentOrdersTable({ orders }: { orders: OrderSummaryDTO[] }) {
  const table = useReactTable({ data: orders, columns, getCoreRowModel: getCoreRowModel() });

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
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="text-center py-6 text-[var(--color-muted-foreground)]">
                سفارشی ثبت نشده است
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}