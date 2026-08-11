import { savedAddressRepository } from "@/features/identity/repositories/saved-address.repository";
import { toSavedAddressDTO } from "@/features/identity/mappers/saved-address.mapper";
import { AddressesList } from "@/features/identity/components/addresses-list";
import { requireUser } from "@/server/auth/guards";

export default async function AddressesPage() {
  const user = await requireUser();
  const addresses = await savedAddressRepository.findByUser(user.id);

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">آدرس‌های من</h1>
      <AddressesList addresses={addresses.map(toSavedAddressDTO)} />
    </div>
  );
}