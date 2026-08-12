import Link from 'next/link';

import type { CategoryTreeNodeDTO } from '../types/category.dto';

export function CategorySidebar({
  tree,
  activeSlug,
}: {
  tree: CategoryTreeNodeDTO[];
  activeSlug: string;
}) {
  return (
    <nav className="space-y-1">
      {tree.map((node) => (
        <CategoryNode
          key={node.id}
          node={node}
          activeSlug={activeSlug}
          depth={0}
        />
      ))}
    </nav>
  );
}

function CategoryNode({
  node,
  activeSlug,
  depth,
}: {
  node: CategoryTreeNodeDTO;
  activeSlug: string;
  depth: number;
}) {
  const isActive = node.slug === activeSlug;

  return (
    <div>
      <Link
        href={`/${node.slug}`}
        style={{
          paddingRight: `${depth * 1}rem`,
        }}
        className={`
          block
          rounded-[var(--radius)]
          px-3
          py-2
          text-sm
          transition-colors
          ${
            isActive
              ? 'bg-[var(--color-primary)] font-medium text-[var(--color-primary-foreground)]'
              : 'hover:bg-[var(--color-muted)]'
          }
        `}
      >
        {node.name}
      </Link>

      {node.children.map((child) => (
        <CategoryNode
          key={child.id}
          node={child}
          activeSlug={activeSlug}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}
