import { Tag } from "@prisma/client/client";
import type { TagDTO } from "../types/tag.dto";

export function toTagDTO(t: Tag): TagDTO {
  return { id: t.id, name: t.name, slug: t.slug };
}
 