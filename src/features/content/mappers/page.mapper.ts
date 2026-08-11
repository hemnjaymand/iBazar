
import { Page } from "@prisma/client/client";
import type { PageDTO } from "../types/page.dto";

export function toPageDTO(page: Page): PageDTO {
  return {
    slug: page.slug,
    title: page.title,
    htmlContent: page.htmlContent,
    isPublished: page.isPublished,
    createdAt: page.updatedAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
  };
}

export function toPageDTOList(pages: Page[]): PageDTO[] {
  return pages.map(toPageDTO);
}
