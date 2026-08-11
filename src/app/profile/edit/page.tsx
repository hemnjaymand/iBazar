import { userRepository } from "@/features/identity/repositories/user.repository";
import { toUserResponseDTO } from "@/features/identity/mappers/user.mapper";
import { requireUser } from "@/server/auth/guards";
import { notFound } from "next/navigation";
import { ProfileForm } from "@/features/identity/components/profile-form";

export default async function ProfileEditPage() {
  const sessionUser = await requireUser();
  const user = await userRepository.findById(sessionUser.id);
  if (!user) notFound();

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">اطلاعات شخصی</h1>
      <ProfileForm user={toUserResponseDTO(user)} />
    </div>
  );
}