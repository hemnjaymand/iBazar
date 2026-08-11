import { savedAddressRepository } from "../repositories/saved-address.repository";
import { toSavedAddressDTO } from "../mappers/saved-address.mapper";
import type { SavedAddressInput } from "../schemas/saved-address.schema";

export async function createSavedAddressService(
  userId: string,
  input: SavedAddressInput,
) {
  if (input.isDefault) {
    await savedAddressRepository.clearDefaultForUser(userId);
  }
  const address = await savedAddressRepository.create(userId, input);
  return toSavedAddressDTO(address);
}
