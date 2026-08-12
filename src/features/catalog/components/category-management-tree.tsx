"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { CategoryFormDialog } from "./category-form-dialog";

import { Button } from "@/shared/ui/button";

import type {
  CategoryTreeNodeDTO,
  CategoryResponseDTO,
} from "../types/category.dto";

import { deleteCategoryAction } from "../actions/category-mutation.actions";

function flatten(
  tree: CategoryTreeNodeDTO[],
): CategoryResponseDTO[] {
  const result: CategoryResponseDTO[] = [];

  for (const node of tree) {
    const { children, ...rest } = node;

    result.push(rest as CategoryResponseDTO);
    result.push(...flatten(children));
  }

  return result;
}

export function CategoryManagementTree({
  tree,
}: {
  tree: CategoryTreeNodeDTO[];
}) {
  const router = useRouter();

  const [dialogState, setDialogState] = useState<
    | {
        mode: "create";
        parentId?: string;
      }
    | {
        mode: "edit";
        category: CategoryResponseDTO;
      }
    | null
  >(null);

  const allCategories = flatten(tree);

  async function handleDelete(id: string) {
    if (!confirm("این دسته‌بندی حذف شود؟")) {
      return;
    }

    const result = await deleteCategoryAction(id);

    if (!result.success) {
      alert(result.error.message);
      return;
    }

    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button
          size="sm"
          onClick={() =>
            setDialogState({
              mode: "create",
            })
          }
        >
          + دسته‌بندی جدید
        </Button>
      </div>

      <div className="space-y-1">
        {tree.map((node) => (
          <CategoryNode
            key={node.id}
            node={node}
            depth={0}
            onEdit={(category) =>
              setDialogState({
                mode: "edit",
                category,
              })
            }
            onDelete={handleDelete}
          />
        ))}
      </div>

      {dialogState && (
        <CategoryFormDialog
          allCategories={allCategories}
          editing={
            dialogState.mode === "edit"
              ? dialogState.category
              : undefined
          }
          onClose={() =>
            setDialogState(null)
          }
          onSuccess={() => {
            setDialogState(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function CategoryNode({
  node,
  depth,
  onEdit,
  onDelete,
}: {
  node: CategoryTreeNodeDTO;
  depth: number;
  onEdit: (category: CategoryResponseDTO) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div>
      <div
        style={{
          paddingRight: `${depth * 1.25}rem`,
        }}
        className="
          flex
          items-center
          justify-between
          rounded-[var(--radius)]
          px-3
          py-2
          hover:bg-[var(--color-muted)]
        "
      >
        <span className="text-sm">
          {node.name}
        </span>

        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(node)}
            className="text-xs text-[var(--color-primary)]"
          >
            ویرایش
          </button>

          <button
            type="button"
            onClick={() => onDelete(node.id)}
            className="text-xs text-[var(--color-destructive)]"
          >
            حذف
          </button>
        </div>
      </div>

      {node.children.map((child) => (
        <CategoryNode
          key={child.id}
          node={child}
          depth={depth + 1}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}