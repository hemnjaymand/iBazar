// config/permissions.ts
export const Permissions = {
  PRODUCT_CREATE: "PRODUCT_CREATE",
  PRODUCT_UPDATE: "PRODUCT_UPDATE",
  PRODUCT_DELETE: "PRODUCT_DELETE",
  ORDER_MANAGE: "ORDER_MANAGE",
} as const;
export type Permission = (typeof Permissions)[keyof typeof Permissions];

export const RolePermissions: Record<string, Permission[]> = {
   CUSTOMER: [],
};
