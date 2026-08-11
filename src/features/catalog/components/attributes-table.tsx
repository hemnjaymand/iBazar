"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { deleteAttributeAction } from "../actions/attribute-mutation.actions";
import { AttributeFormDialog } from "./attribute-form-dialog";
import type { AttributeDTO } from "../types/attribute.dto";
import { toast } from "@/shared/lib/toast";

const columnHelper = createColumnHelper<AttributeDTO>();

const columns = [
  columnHelper.accessor("name", { header: "نام ویژگی" }),
  columnHelper.accessor((row) => row.values.length, {
    id: "valueCount",
    header: "تعداد مقادیر",
    cell: (info) => <span className="num">{info.getValue().toLocaleString("fa-IR")}</span>,
  }),
  columnHelper.display({
    id: "values",
    header: "مقادیر",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.values.map((v) => (
          <Badge key={v.id} variant="new">{v.value}</Badge>
        ))}
      </div>
    ),
  }),
];

export function AttributesTable({ attributes }: { attributes: AttributeDTO[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  async function handleDelete(id: string) {
    if (!confirm("این ویژگی حذف شود؟")) return;
    const result = await deleteAttributeAction(id);
    if (!result.success) {
      toast.error(result.error.message);
      return;
    }
    toast.success("ویژگی حذف شد");
    router.refresh();
  }

  const table = useReactTable({ data: attributes, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setShowForm(true)}>+ ویژگی جدید</Button>
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
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(row.original.id)}>
                    حذف
                  </Button>
                </td>
              </tr>
            ))}
            {attributes.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-6 text-[var(--color-muted-foreground)]">
                  ویژگی‌ای ثبت نشده است
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <AttributeFormDialog
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            toast.success("ویژگی ساخته شد");
            router.refresh();
          }}
        />
      )}
    </>
  );
}