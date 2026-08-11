

import { SavedAddress } from "@prisma/client";
import type { SavedAddressDTO } from "../types/saved-address.dto";

export function toSavedAddressDTO(a: SavedAddress): SavedAddressDTO {
  return {
    id: a.id,
    label: a.label,
    fullName: a.fullName,
    phone: a.phone,
    addressLine: a.addressLine,
    city: a.city,
    postalCode: a.postalCode,
    isDefault: a.isDefault,
  };
}