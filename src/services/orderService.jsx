import api from "@/lib/axios";

//Gọi api xuống be
export const orderService = {
  //Gọi hàm tạo order
  createOrder: async (items, customerInfo) => {
    const res = await api.post(
      "orders",
      {
        items,
        customerInfo,
      },
      { withCredentials: true },
    );
    console.log("ser", res.data);
    return res.data;
  },

  //Lấy danh sách đơn hàng & phân trang
  getOrders: async (page = 1, limit = 5, status = "ALL") => {
    const res = await api.get(
      "orders",
      {
        params: {
          page: page,
          limit: limit,
          status: status,
        },
      },
      { withCredentials: true },
    );
    return res.data;
  },
  //Cập nhật trạng thái đơn hàng
  updateStatus: async (orderId, newStatus) => {
    const res = await api.patch(
      `orders/${orderId}`,
      {
        newStatus,
      },
      { withCredentials: true },
    );
    return res.data;
  },

  //Lấy dữ liệu thống kê
  getStats: async () => {
    const res = await api.get("orders/stats", { withCredentials: true });

    return res.data;
  },
};
