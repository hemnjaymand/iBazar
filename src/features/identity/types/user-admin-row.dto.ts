export interface UserAdminRowDTO {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  isActive: boolean;
  createdAt: string;
}
