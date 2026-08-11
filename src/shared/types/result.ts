export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

export function ok<T>(data: T): Result<T> {
  return { success: true, data };
}
export function fail(code: string, message: string): Result<never> {
  return { success: false, error: { code, message } };
}
