import { orderRepository } from "../repositories/order.repository";
import { toOrderDTO } from "../mappers/order.mapper";
import { PAGINATION_DEFAULTS } from "@/config/pagination";

// تایپ page صریحاً به number تغییر یافت
export async function listOrdersForAdminService(
  page: number = PAGINATION_DEFAULTS.page,
) {
  const take = PAGINATION_DEFAULTS.pageSize;
  const skip = (page - 1) * take;
  const orders = await orderRepository.findAllForAdmin({ skip, take });
  return orders.map(toOrderDTO);
}
