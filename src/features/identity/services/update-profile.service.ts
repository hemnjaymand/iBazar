import { userRepository } from "../repositories/user.repository";
import { toUserResponseDTO } from "../mappers/user.mapper";
import { UpdateProfileInput } from "../schemas/update-profile.schema";

export async function updateProfileService(userId: string, input: UpdateProfileInput) {
  const updated = await userRepository.update(userId, { name: input.name });
  return toUserResponseDTO(updated);
}