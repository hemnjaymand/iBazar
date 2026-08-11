import { pageRepository } from "../repositories/page.repository";
import { toPageDTO } from "../mappers/page.mapper";
import type { UpsertPageInput } from "../schemas/page.schema";

export async function upsertPageService(input: UpsertPageInput) {
  const page = await pageRepository.upsert({
    slug: input.slug,
    title: input.title,
    htmlContent: input.htmlContent,
    isPublished: input.isPublished,
  });
  return toPageDTO(page);
}
