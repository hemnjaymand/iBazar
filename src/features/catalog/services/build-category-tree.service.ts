// features/catalog/services/build-category-tree.service.ts
import { toCategoryResponseDTO } from "../mappers/category.mapper";
import { categoryRepository } from "../repositories/category.repository";
import type { CategoryTreeNodeDTO } from "../types/category.dto";

export async function buildCategoryTreeService(): Promise<
  CategoryTreeNodeDTO[]
> {
  const all = await categoryRepository.findAll();
  const dtos = all.map(toCategoryResponseDTO);

  const byId = new Map(
    dtos.map((c) => [c.id, { ...c, children: [] as CategoryTreeNodeDTO[] }]),
  );
  const roots: CategoryTreeNodeDTO[] = [];

  for (const node of byId.values()) {
    if (node.parentId) {
      byId.get(node.parentId)?.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}
