import React, { useEffect, useState } from "react";
import { MoreVertical, CheckCircle, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useOrderStore } from "@/stores/useOrderStore";

export default function OrdersView() {
  //STATEs & BIẾN
  const [statusFilter, setStatusFilter] = useState("ALL"); //Trạng thái mặc định
  const [page, setPage] = useState(1); //quản lí page hiện tại
  const limit = 5; //5 sản phẩm mỗi trang
  const [cancelOrderId, setCancelOrderId] = useState(null); //Id order muốn xóa
  //STOREs
  const { orders, pagination, fetchOrders, updateStatus } = useOrderStore();
  //EFFECTs
  useEffect(() => {
    fetchOrders(page, limit, statusFilter);
  }, [page, limit, statusFilter, fetchOrders]);
  //Các hàm xử lý
  // Xử lí dữ liệu Status Badge hiển thị màu UI
  const renderStatus = (status) => {
    const statusConfig = {
      pending: {
        color:
          "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
        text: "Pending",
      },
      completed: {
        color:
          "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
        text: "Completed",
      },
      cancelled: {
        color: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
        text: "Cancelled",
      },
    };
    const current = statusConfig[status] || statusConfig.pending;

    return <Badge className={current.color}>{current.text}</Badge>;
  };

  // Format Ngày tháng từ MongoDB
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  //Xử lý đổi trạng thái đơn hàng
  const handleUpdateStatus = async (orderId, newStatus) => {
    // Gọi hàm update từ Store
    const res = await updateStatus(orderId, newStatus);

    if (res) {
      setCancelOrderId(null); // Đóng popup nếu đang mở
      fetchOrders(page, limit, statusFilter);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Quản lí đơn hàng
          </h2>
          <p className="text-sm text-gray-500 mt-1">Theo dõi tất cả đơn hàng</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-sm font-medium text-gray-700 mr-2 hidden sm:block">
          Lọc theo trạng thái:
        </div>
        <div className="w-full sm:w-40">
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setPage(1); //Luôn gọi trang đầu tiên
            }}
          >
            <SelectTrigger className="w-full bg-gray-50 border-gray-200 focus:ring-black">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-[12%]">
                  Mã đơn hàng
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-[12%]">
                  Ngày tạo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-[16%]">
                  Tên khách hàng
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-auto">
                  Tóm tắt đơn hàng
                </th>

                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase w-[12%]">
                  Tổng tiền
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-[10%] pl-6">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase w-[5%]">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {orders?.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Cột Mã Đơn Hàng  */}
                  <td className="px-4 py-4 whitespace-nowrap align-middle">
                    <span className="text-sm font-bold text-gray-900">
                      {order.orderCode}
                    </span>
                  </td>

                  {/* Cột Ngày Tạo */}
                  <td className="px-4 py-4 whitespace-nowrap align-middle">
                    <span className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </span>
                  </td>

                  {/* Cột Khách Hàng */}
                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">
                        {order.customerInfo?.name || ""}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5 truncate">
                        {order.customerInfo?.email || "Không có email"}
                      </span>
                    </div>
                  </td>

                  {/* Cột Tóm Tắt Đơn Hàng */}
                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-col gap-1 text-sm text-gray-600">
                      {order.items?.length > 0 ? (
                        order.items.map((item, idx) => (
                          <span key={idx}>
                            <span className="font-medium text-gray-800">
                              {item.quantity}x
                            </span>{" "}
                            {item.product?.name || "Sản phẩm ẩn"}
                          </span>
                        ))
                      ) : (
                        <span>Trống</span>
                      )}
                    </div>
                  </td>

                  {/* Cột Tổng Tiền */}
                  <td className="px-4 py-4 whitespace-nowrap text-right align-middle">
                    <span className="text-sm font-mono font-bold text-gray-900">
                      {order.total_amount?.toLocaleString()}đ
                    </span>
                  </td>

                  {/* Cột Trạng Thái */}
                  <td className="px-4 py-4 whitespace-nowrap pl-6 align-middle">
                    {renderStatus(order.status)}
                  </td>

                  {/* Cột Thao Tác */}
                  <td className="px-4 py-4 whitespace-nowrap text-right align-middle">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác đơn hàng</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {order.status === "pending" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateStatus(order._id, "completed")
                            }
                          >
                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                            Đánh dấu Hoàn thành
                          </DropdownMenuItem>
                        )}
                        {order.status !== "cancelled" && (
                          <DropdownMenuItem
                            onClick={() => setCancelOrderId(order._id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Hủy đơn hàng
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}

              {/* Hiển thị nếu mảng rỗng */}
              {(!orders || orders.length === 0) && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination?.totalPages > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="hidden md:block">
              <p className="text-xs text-gray-500">
                Tổng cộng{" "}
                <span className="font-semibold text-gray-900">
                  {pagination.totalItems}
                </span>{" "}
                đơn hàng
              </p>
            </div>
            <Pagination className="justify-end w-full md:w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => page > 1 && setPage(page - 1)}
                    className={
                      page <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {/* Generate tự động các nút số 1, 2, 3... dựa theo tổng số trang */}
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1,
                ).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === page}
                      onClick={() => setPage(p)}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      page < pagination.totalPages && setPage(page + 1)
                    }
                    className={
                      page >= pagination.totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      {/* Xác nhận hủy */}
      <AlertDialog
        open={!!cancelOrderId}
        onOpenChange={(isOpen) => !isOpen && setCancelOrderId(null)}
      >
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy đơn hàng này?</AlertDialogTitle>
            <AlertDialogDescription>
              Đơn hàng sẽ không thể khôi phục. Số lượng sản phẩm trong đơn sẽ
              được
              <strong className="text-black">
                {" "}
                tự động cộng trả lại vào kho
              </strong>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm">
              Quay lại
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 rounded-sm"
              onClick={() => handleUpdateStatus(cancelOrderId, "cancelled")}
            >
              Xác nhận Hủy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
