export interface ActivityItemDTO {
  id: string;
  type: "ORDER_PLACED" | "USER_REGISTERED" | "LOW_STOCK";
  message: string;
  timestamp: string;
}
