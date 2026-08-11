// config/roles.ts
export const Roles = {
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER",
} as const;
export type Role = (typeof Roles)[keyof typeof Roles];