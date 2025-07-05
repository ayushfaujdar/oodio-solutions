export const ADMIN_PASSWORD = "admin123";

export function isValidAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}
