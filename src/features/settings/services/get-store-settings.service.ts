import { prisma } from "../../../../lib/prisma";

export async function getLogoUrl() {
  try {
    const setting = await prisma.appSetting.findFirst({
      where: {
        key: "logo_url",
        isActive: true,
      },
    });

    return setting?.value ?? "/logo.png";

  } catch {
    return "/logo.png";
  }
}