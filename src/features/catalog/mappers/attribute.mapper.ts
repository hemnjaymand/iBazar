import { Attribute } from "@prisma/client/client";

export function toAttributeDTO(attribute: Attribute) {
  return {
    id: attribute.id,
    name: attribute.name,
    slug: attribute.slug,
  
  };
}
