import { appSettingRepository } from "../repositories/app-setting.repository";

export async function getAppSettingsService(): Promise<Record<string, string>> {
  const settings = await appSettingRepository.findAll();
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}
