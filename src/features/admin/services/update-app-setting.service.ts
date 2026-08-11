import { appSettingRepository } from "../repositories/app-setting.repository";
import type { UpdateAppSettingInput } from "../schemas/app-setting.schema";

export async function updateAppSettingService(input: UpdateAppSettingInput) {
  return appSettingRepository.upsert(input.key, input.value);
}
