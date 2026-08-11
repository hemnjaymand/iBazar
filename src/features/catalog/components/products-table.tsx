"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  deleteProductAction,
  toggleProductPublishAction,
} from "../actions/product-mutation.actions";
import type { ProductListItemDTO } from "../types/product.dto";
import type { ProductTableRow } from "../types/product-table-row.dto";
import { toast } from "@/shared/lib/toast";

/**
 * این تبدیل قبلاً در product.mapper.ts بود — از اونجا حذفش کردیم چون
 * Mapper نباید بدونه UI قراره چه شکلی از داده بخواد؛ این تبدیل مخصوص
 * همین جدوله، پس جاش همینجاست.
 */
function toProductTableRow(p: ProductListItemDTO): ProductTableRow {
  return {
    id: p.id,
    name: p.name,
    price: p.defaultVariant?.price ?? 0,
    stock: p.defaultVariant?.inventory ?? 0,
    slug: p.slug,
    isPublished: p.isPublished,
    isActive: p.isActive,
    createdAt: p.createdAt,
    categoryName: p.categoryId,
  };
}

const columnHelper = createColumnHelper<ProductTableRow>();

export function ProductsTable({
  products,
}: {
  products: ProductListItemDTO[];
}) {
  const router = useRouter();
  const rows = useMemo(() => products.map(toProductTableRow), [products]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", { header: "محصول" }),
      columnHelper.accessor("price", {
        header: "قیمت",
        cell: (info) => (
          <span className="num">{info.getValue().toLocaleString("fa-IR")}</span>
        ),
      }),
      columnHelper.accessor("stock", {
        header: "موجودی",
        cell: (info) => (
          <span className="num">{info.getValue().toLocaleString("fa-IR")}</span>
        ),
      }),
      columnHelper.accessor("isPublished", {
        header: "وضعیت",
        cell: (info) =>
          info.getValue() ? (
            <Badge variant="new">منتشر شده</Badge>
          ) : (
            <Badge variant="outOfStock">پیش‌نویس</Badge>
          ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleTogglePublish = useCallback(
    async (id: string, current: boolean) => {
      const result = await toggleProductPublishAction({
        id,
        isPublished: !current,
      });
      if (!result.success) {
        toast.error(result.error.message);
        return;
      }
      toast.success(current ? "محصول به پیش‌نویس برگشت" : "محصول منتشر شد");
      router.refresh();
    },
    [router],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("این محصول حذف شود؟")) return;
      const result = await deleteProductAction(id);
      if (!result.success) {
        toast.error(result.error.message);
        return;
      }
      toast.success("محصول غیرفعال شد");
      router.refresh();
    },
    [router],
  );

  return (
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
            <tr key={row.id} className="border-t border-[var(--color-border)]">
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
                    onClick={() =>
                      handleTogglePublish(
                        row.original.id,
                        row.original.isPublished,
                      )
                    }
                  >
                    {row.original.isPublished ? "عدم انتشار" : "انتشار"}
                  </Button>
                  <Link href={`/admin/products/${row.original.id}`}>
                    <Button size="sm" variant="outline">
                      ویرایش
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(row.original.id)}
                  >
                    حذف
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="text-center py-6 text-[var(--color-muted-foreground)]"
              >
                محصولی ثبت نشده است
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
