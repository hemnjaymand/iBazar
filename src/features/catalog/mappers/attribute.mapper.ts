import type { Attribute } from "@prisma/client";

export function toAttributeDTO(attribute: Attribute) {
  return {
    id: attribute.id,
    name: attribute.name,
    slug: attribute.slug,
  
  };
}
