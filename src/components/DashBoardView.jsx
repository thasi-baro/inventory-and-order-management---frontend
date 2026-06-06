import React, { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Download,
} from "lucide-react";
import { useOrderStore } from "@/stores/useOrderStore.jsx";
import { useAuthStore } from "@/stores/useAuthStore";

export default function DashboardView() {
  //Lấy thông tin từ store
  const {
    totalOrders,
    totalProducts,
    thisMonthRevenue,
    percentage,
    revenueOverTime,
    orderStatusBreakdown,
    topProducts,
    inventoryHealth,
    getStats,
  } = useOrderStore();
  const { user } = useAuthStore();
  //Gọi hàm lấy dữ liệu thống kê khi vừa load trang lên
  useEffect(() => {
    getStats(); //Cập nhật dữ liệu khi thay đổi
  }, [getStats, user?.lowStockThreshold]);

  //Hàm xuất excel
  const handleExportExcel = () => {
    //Format dữ liệu
    const overviewData = [
      {
        "Tổng đơn hàng": totalOrders || 0,
        "Số sản phẩm trong kho": totalProducts || 0,
        "Doanh thu tháng này (VNĐ)": thisMonthRevenue || 0,
        "Tăng trưởng (%)": `${percentage > 0 ? "+" : ""}${percentage || 0}%`,
      },
    ];

    const revenueData =
      revenueOverTime?.map((item) => ({
        Ngày: item._id,
        "Doanh thu (VNĐ)": item.revenue,
      })) || [];

    const topProductsExport =
      topProducts?.map((p, index) => ({
        "Xếp hạng": `Top ${index + 1}`,
        "Tên sản phẩm": p.name,
        "Số lượng đã bán": p.totalSold,
      })) || [];

    const orderStatusExport = [
      {
        "Trạng thái": "Hoàn thành (Completed)",
        "Số lượng": orderStatusBreakdown?.completed || 0,
      },
      {
        "Trạng thái": "Đang xử lý (Pending)",
        "Số lượng": orderStatusBreakdown?.pending || 0,
      },
      {
        "Trạng thái": "Đã hủy (Cancelled)",
        "Số lượng": orderStatusBreakdown?.cancelled || 0,
      },
    ];

    const inventoryExport = [
      {
        "Phân loại": "Còn nhiều hàng (In Stock > 10)",
        "Số lượng": inventoryHealth?.inStock || 0,
      },
      {
        "Phân loại": "Sắp hết hàng (Low Stock 1-10)",
        "Số lượng": inventoryHealth?.lowStock || 0,
      },
      {
        "Phân loại": "Hết hàng (Out of Stock = 0)",
        "Số lượng": inventoryHealth?.outOfStock || 0,
      },
    ];
    //Tạo workbook
    const workbook = XLSX.utils.book_new();
    //Chèn từng sheet là một thông tin riêng
    const appendSheet = (data, sheetName, colWidths) => {
      const worksheet = XLSX.utils.json_to_sheet(data);
      worksheet["!cols"] = colWidths;
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    };

    appendSheet(overviewData, "Tổng quan", [
      { wch: 15 },
      { wch: 22 },
      { wch: 25 },
      { wch: 15 },
    ]);
    appendSheet(revenueData, "Doanh thu", [{ wch: 15 }, { wch: 20 }]);
    appendSheet(topProductsExport, "Top Sản phẩm", [
      { wch: 12 },
      { wch: 40 },
      { wch: 18 },
    ]);
    appendSheet(orderStatusExport, "Trạng thái Đơn", [
      { wch: 30 },
      { wch: 15 },
    ]);
    appendSheet(inventoryExport, "Kho hàng", [{ wch: 35 }, { wch: 15 }]);

    XLSX.writeFile(
      workbook,
      `BaoCaoThongKe_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  //Xử lý data dữ liệu biểu đồ tròn (Order status)
  const dynamicOrderStatus = useMemo(() => {
    if (!orderStatusBreakdown) return [];
    const total =
      (orderStatusBreakdown.completed || 0) +
      (orderStatusBreakdown.pending || 0) +
      (orderStatusBreakdown.cancelled || 0);

    return [
      {
        name: "Completed",
        value: orderStatusBreakdown.completed || 0,
        color: "#10B981",
        percent: total
          ? Math.round(((orderStatusBreakdown.completed || 0) / total) * 100)
          : 0,
      },
      {
        name: "Pending",
        value: orderStatusBreakdown.pending || 0,
        color: "#F59E0B",
        percent: total
          ? Math.round(((orderStatusBreakdown.pending || 0) / total) * 100)
          : 0,
      },
      {
        name: "Cancelled",
        value: orderStatusBreakdown.cancelled || 0,
        color: "#EF4444",
        percent: total
          ? Math.round(((orderStatusBreakdown.cancelled || 0) / total) * 100)
          : 0,
      },
    ];
  }, [orderStatusBreakdown]);

  // Cấu hình Biểu đồ inventory health
  const inventoryHealthSummary = useMemo(() => {
    return [
      {
        name: "In Stock",
        value: inventoryHealth?.inStock || 0,
        color: "#3B82F6",
      },
      {
        name: "Low Stock",
        value: inventoryHealth?.lowStock || 0,
        color: "#8B5CF6",
      },
      {
        name: "Out of Stock",
        value: inventoryHealth?.outOfStock || 0,
        color: "#94A3B8",
      },
    ].filter((item) => item.value > 0);
  }, [inventoryHealth]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Tổng quan Dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi doanh thu và kho hàng hiện tại
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>
      {/* Thông tin các thẻ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Doanh thu tháng này
            </p>
            <DollarSign className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900">
              {thisMonthRevenue?.toLocaleString("vi-VN")} đ
            </h3>
            {percentage !== undefined && (
              <span
                className={`flex items-center text-sm font-medium ${
                  percentage >= 0 ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {percentage >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-0.5" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-0.5" />
                )}
                {percentage > 0 ? "+" : ""}
                {percentage}%
              </span>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Số đơn hàng
            </p>
            <ShoppingCart className="w-4 h-4 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {totalOrders || 0}
          </h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Số sản phẩm trong kho
            </p>
            <Package className="w-4 h-4 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {totalProducts || 0}
          </h3>
        </div>
      </div>
      {/* Biểu đồ Doanh thu & Biểu đồ Đơn hàng */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Doanh số theo ngày
              </h3>
              <p className="text-xs text-gray-500 mt-1">30 ngày qua</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueOverTime || []}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="_id"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  dy={10}
                  tickFormatter={(val) => {
                    if (!val) return "";
                    const parts = val.split("-");
                    return `${parts[2]}/${parts[1]}`;
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  tickFormatter={(value) => {
                    if (value >= 1000000)
                      return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                    return value;
                  }}
                />
                <Tooltip
                  formatter={(value) => [
                    `${value.toLocaleString("vi-VN")} đ`,
                    "Doanh thu",
                  ]}
                  labelFormatter={(label) => `Ngày: ${label}`}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900">
            Trạng thái đơn hàng
          </h3>

          <div className="flex-1 relative flex items-center justify-center min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dynamicOrderStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {dynamicOrderStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="block text-2xl font-bold text-gray-900">
                {totalOrders || 0}
              </span>
              <span className="block text-[10px] text-gray-500">Tổng Đơn</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-4">
            {dynamicOrderStatus.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                <div className="text-[10px]">
                  <p className="text-gray-700 font-medium">{item.name}</p>
                  <p className="text-gray-500">({item.percent}%)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/*  Top Sản phẩm & Kho hàng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900">
            Top 5 sản phẩm bán chạy
          </h3>
          <p className="text-xs text-gray-500 mt-1 mb-6">Trong tháng</p>

          <div className="space-y-5">
            {topProducts?.length > 0 ? (
              topProducts.map((p, idx) => {
                const maxSold = topProducts[0]?.totalSold || 1;
                const widthPercent = Math.min(
                  100,
                  Math.round((p.totalSold / maxSold) * 100),
                );
                return (
                  <div key={p.id || idx}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium text-gray-900">
                        {p.name}
                      </span>
                      <span className="text-gray-500">
                        {p.totalSold} đã bán
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gray-800 h-full rounded-full transition-all duration-500"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 text-center py-10">
                Chưa có sản phẩm nào được bán.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900">Sức khỏe Kho hàng</h3>
          <p className="text-xs text-gray-500 mt-1">Phân bổ tồn kho hiện tại</p>

          <div className="h-64 flex items-center justify-center mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryHealthSummary}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  dataKey="value"
                  stroke="white"
                  strokeWidth={2}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={true}
                  fontSize={12}
                >
                  {inventoryHealthSummary.map((entry, index) => (
                    <Cell key={`cell-inv-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    color: "#111827",
                  }}
                  itemStyle={{ fontWeight: "500" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
