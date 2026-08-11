import { getProfileOverviewService } from "@/features/identity/services/get-profile-overview.service";
import { ProfileOverviewCards } from "@/features/identity/components/profile-overview-cards";
import { requireUser } from "@/server/auth/guards";

export default async function ProfileOverviewPage() {
  const user = await requireUser();
  const overview = await getProfileOverviewService(user.id);

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">پروفایل من</h1>
      <ProfileOverviewCards overview={overview} />
    </div>
  );
}