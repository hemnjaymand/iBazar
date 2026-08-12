
"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type { OrderSummaryDTO } from "@/features/ordering";

const columnHelper = createColumnHelper<OrderSummaryDTO>();

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: "در انتظار",
    CONFIRMED: "تأیید شده",
    PROCESSING: "در حال پردازش",
    SHIPPED: "ارسال شده",
    DELIVERED: "تحویل شده",
    CANCELLED: "لغو شده",
    COMPLETED: "تکمیل شده",
  };

  return labels[status] ?? status;
}

function getStatusClassName(status: string) {
  switch (status) {
    case "COMPLETED":
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20";

    case "CONFIRMED":
    case "PROCESSING":
      return "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20";

    case "SHIPPED":
      return "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20";

    case "CANCELLED":
      return "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20";

    case "PENDING":
    default:
      return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20";
  }
}

const columns = [
  columnHelper.accessor("orderNumber", {
    header: "شماره سفارش",
    cell: (info) => (
      <span className="num font-medium text-[var(--color-foreground)]">
        {info.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor("status", {
    header: "وضعیت",
    cell: (info) => {
      const status = info.getValue();

      return (
        <span
          className={`
            inline-flex
            items-center
            rounded-full
            px-2.5
            py-1
            text-xs
            font-medium
            ${getStatusClassName(status)}
          `}
        >
          {getStatusLabel(status)}
        </span>
      );
    },
  }),

  columnHelper.accessor("total", {
    header: "مبلغ",
    cell: (info) => (
      <span className="num whitespace-nowrap font-medium text-[var(--color-foreground)]">
        {parseFloat(info.getValue()).toLocaleString("fa-IR")} تومان
      </span>
    ),
  }),

  columnHelper.accessor("createdAt", {
    header: "تاریخ",
    cell: (info) => (
      <span className="num whitespace-nowrap text-[var(--color-muted-foreground)]">
        {new Date(info.getValue()).toLocaleDateString("fa-IR")}
      </span>
    ),
  }),
];

export function RecentOrdersTable({
  orders,
}: {
  orders: OrderSummaryDTO[];
}) {
  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-[var(--color-border)] bg-[var(--color-muted)]/50"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="
                      whitespace-nowrap
                      px-4
                      py-3
                      text-right
                      text-xs
                      font-semibold
                      text-[var(--color-muted-foreground)]
                    "
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-[var(--color-border)]">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="
                  transition-colors
                  hover:bg-[var(--color-muted)]/30
                "
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="
                      whitespace-nowrap
                      px-4
                      py-3.5
                      text-right
                      text-[var(--color-foreground)]
                    "
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="
                    px-4
                    py-12
                    text-center
                    text-sm
                    text-[var(--color-muted-foreground)]
                  "
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-2xl opacity-50">📦</span>

                    <span className="font-medium">
                      سفارشی ثبت نشده است
                    </span>

                    <span className="text-xs">
                      هنوز سفارشی برای نمایش وجود ندارد.
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
