import { attributeRepository } from "../repositories/attribute.repository";
import type { AttributeDTO } from "../types/attribute.dto";

export async function listAttributesService(): Promise<AttributeDTO[]> {
  const attributes = await attributeRepository.findAll();
  return attributes.map((a) => ({
    id: a.id,
    name: a.name,
    slug: a.slug,
    values: a.values.map((v) => ({ id: v.id, value: v.value, slug: v.slug })),
  }));
}