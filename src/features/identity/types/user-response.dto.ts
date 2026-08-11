// features/identity/types/user-response.dto.ts
export interface UserResponseDTO {
  id: string;
  name: string | null;
  email: string;
  createdAt :string;
  role: "ADMIN" | "CUSTOMER";
  
}