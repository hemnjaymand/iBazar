import Link from "next/link";
import type { CategoryTreeNodeDTO } from "../types/category.dto";

// این کامپوننت به‌صورت بازگشتی (Recursive) خودش رو صدا می‌زنه تا هر عمق
// از درخت دسته‌بندی رو نشون بده — کاملاً Server، چون هیچ کلیکی state رو
// عوض نمی‌کنه (فقط لینک ساده‌ست).
export function CategorySidebar({ tree, activeSlug }: { tree: CategoryTreeNodeDTO[]; activeSlug: string  }) {
  return (
    <nav className="space-y-1">
      {tree.map((node) => (
        <CategoryNode key={node.id} node={node} activeSlug={activeSlug} depth={0} />
      ))}
    </nav>
  );
}

function CategoryNode({ node, activeSlug, depth }: { node: CategoryTreeNodeDTO; activeSlug: string; depth: number }) {
  const isActive = node.slug === activeSlug;
  return (
    <div>
      <Link
        href={`/${node.slug}`}
        style={{ paddingRight: `${depth * 1}rem` }}
        className={`block px-3 py-2 rounded-[var(--radius)] text-sm transition-colors ${
          isActive
            ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] font-medium"
            : "hover:bg-[var(--color-muted)]"
        }`}
      >
        {node.name}
      </Link>
      {node.children.map((child) => (
        <CategoryNode key={child.id} node={child} activeSlug={activeSlug} depth={depth + 1}  />
      ))}
    </div>
  );
}