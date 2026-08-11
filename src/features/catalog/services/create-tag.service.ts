import { tagRepository } from "../repositories/tag.repository";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import type { CreateTagInput } from "../schemas/tag.schema";
import { toTagDTO } from "../mappers/tag.mapper";

export async function createTagService(input: CreateTagInput) {
  const existing = await tagRepository.findBySlug(input.slug);
  if (existing) {
    throw new BusinessError("این تگ قبلاً وجود دارد", ErrorCodes.TAG_ALREADY_EXISTS);
  }
  const tag = await tagRepository.create(input);
  return toTagDTO(tag);
}
