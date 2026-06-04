import { create } from "zustand";
import { toast } from "sonner";
import { orderService } from "@/services/orderService";

export const useOrderStore = create((set, get) => ({
  loading: false,
  error: null,
  orders: [],
  pagination: null,
  //Tạo đơn hàng
  createOrder: async (data) => {
    set({ loading: true });
    try {
      const res = await orderService.createOrder(data.items, data.customerInfo);
      if (res) {
        //Thông báo thành công
        toast.success("Tạo đơn hàng thành công");
        set({ loading: false });

        console.log("store", res);
        return true;
      }
    } catch (error) {
      console.error("Lỗi tạo đơn hàng:", error);

      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi tạo đơn hàng!";

      toast.error(errorMessage);
      set({ error: errorMessage, loading: false });

      return false;
    }
  },
  //Lấy các đơn hàng và phân trang
  fetchOrders: async (page, limit, status) => {
    set({ loading: true, error: null });
    try {
      const res = await orderService.getOrders(page, limit, status);

      set({ orders: res.orders, pagination: res.pagination });
      return { success: true };
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      const errorMessage =
        error.response?.data?.message || "Lỗi khi lấy danh sách đơn hàng";
      set({
        error: errorMessage,
      });
      toast.error(errorMessage);
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },

  //Cập nhật trạng thái đơn hàng
  updateStatus: async (orderId, newStatus) => {
    set({ loading: true });
    try {
      await orderService.updateStatus(orderId, newStatus);

      toast.success("Cập nhật trạng thái thành công");
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      const errorMessage =
        error.response?.data?.message || "Lỗi khi cập nhật trạng thái đơn hàng";
      set({
        error: errorMessage,
      });
      toast.error(errorMessage);
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },
}));
