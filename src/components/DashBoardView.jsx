import React, { useState, useMemo, useEffect } from "react";
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
  DollarSign,
  ShoppingCart,
  Package,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { REVENUE_LAST_7_DAYS, REVENUE_LAST_30_DAYS } from "../initialData.jsx"; // Đảm bảo đường dẫn đúng
import { useProductStore } from "@/stores/useProductStore.jsx";
import { useOrderStore } from "@/stores/useOrderStore.jsx";
export default function DashboardView({
  products = [],
  orders = [],
  onNavigate,
}) {
  const [revenueRange, setRevenueRange] = useState("7days");
  const { pagination, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders(1, 5, "ALL");
  }, [fetchOrders]);
  // Tính toán số liệu tổng quan
  const stats = useMemo(() => {
    const completedOrders = orders.filter((o) => o.status === "Completed");
    const totalRev = completedOrders.reduce((acc, o) => acc + o.totalAmount, 0);
    return {
      totalRevenue: totalRev > 0 ? totalRev : 128430, // Dùng số giả nếu chưa có orders
      totalOrders: orders.length > 0 ? orders.length : 1240,
      distinctProducts: products.length > 0 ? products.length : 856,
    };
  }, [products, orders]);

  // Cấu hình Biểu đồ Tròn (Order Status)
  const orderStatusSummary = useMemo(() => {
    return [
      { name: "Completed", value: 45, color: "#111827" }, // Đen đậm
      { name: "Pending", value: 30, color: "#6B7280" }, // Xám vừa
      { name: "Cancelled", value: 25, color: "#E5E7EB" }, // Xám nhạt
    ];
  }, [orders]);

  // Cấu hình Biểu đồ Sức khỏe Kho hàng (Inventory Health)
  const inventoryHealthSummary = [
    { name: "In Stock", value: 60, color: "#111827" },
    { name: "Low Stock", value: 25, color: "#9CA3AF" },
    { name: "Out of Stock", value: 15, color: "#F3F4F6" },
  ];

  // Lấy Top 5 Sản phẩm
  const topProducts = useMemo(() => {
    if (products.length === 0) {
      return [
        { id: 1, name: "Logitech MX Master 3S", unitsSold: 420 },
        { id: 2, name: 'MacBook Pro 16" M3', unitsSold: 315 },
        { id: 3, name: 'Dell UltraSharp 27"', unitsSold: 288 },
        { id: 4, name: "iPad Air M2", unitsSold: 190 },
      ];
    }
    return [...products].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 5);
  }, [products]);

  const activeRevenueData =
    revenueRange === "7days" ? REVENUE_LAST_7_DAYS : REVENUE_LAST_30_DAYS;

  return (
    <div className="space-y-6">
      {/* HÀNG 1: 3 Thẻ Chỉ số (Stats Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Thẻ Doanh thu */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Revenue
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                ${stats.totalRevenue.toLocaleString()}
              </h3>
            </div>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-4">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="font-medium">+12.5%</span>
          </div>
        </div>

        {/* Thẻ Đơn hàng */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Orders
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {pagination?.totalItems}
              </h3>
            </div>
            <ShoppingCart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-4">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="font-medium">+8.2%</span>
          </div>
        </div>

        {/* Thẻ Sản phẩm */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Products
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {stats.distinctProducts}
              </h3>
            </div>
            <Package className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-4">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-medium">-2 items</span>
          </div>
        </div>
      </div>

      {/* HÀNG 2: Biểu đồ Doanh thu & Biểu đồ Đơn hàng */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái (Chiếm 2/3): Biểu đồ Area Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Revenue Over Time
              </h3>
              <p className="text-xs text-gray-500 mt-1">Last 7 Days</p>
            </div>
            <button className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded hover:bg-gray-50">
              Last 7 Days ▾
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={activeRevenueData}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E5E7EB" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#E5E7EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#D1D5DB"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cột phải (Chiếm 1/3): Biểu đồ Donut Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900">
            Order Status Breakdown
          </h3>
          <p className="text-xs text-gray-500 mt-1">Current Active Orders</p>

          <div className="flex-1 relative flex items-center justify-center min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusSummary}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {orderStatusSummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="block text-2xl font-bold text-gray-900">
                {stats.totalOrders}
              </span>
              <span className="block text-[10px] text-gray-500">Total</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-4">
            {orderStatusSummary.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                <div className="text-[10px]">
                  <p className="text-gray-700 font-medium">{item.name}</p>
                  <p className="text-gray-500">({item.value}%)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HÀNG 3: Top Sản phẩm & Sức khỏe Kho */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Products */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900">
            Top 5 Selling Products
          </h3>
          <p className="text-xs text-gray-500 mt-1 mb-6">
            By Volume (This Month)
          </p>

          <div className="space-y-5">
            {topProducts.map((p, idx) => {
              const maxSold = topProducts[0]?.unitsSold || 500;
              const widthPercent = Math.min(
                100,
                Math.round((p.unitsSold / maxSold) * 100),
              );
              return (
                <div key={p.id || idx}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-gray-900">{p.name}</span>
                    <span className="text-gray-500">{p.unitsSold} units</span>
                  </div>
                  <div className="w-full bg-transparent h-6">
                    <div
                      className="bg-gray-800 h-full transition-all duration-500"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inventory Health */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900">Inventory Health</h3>
          <p className="text-xs text-gray-500 mt-1">Stock Level Distribution</p>

          <div className="h-64 flex items-center justify-center mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryHealthSummary}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  stroke="white"
                  strokeWidth={2}
                >
                  {inventoryHealthSummary.map((entry, index) => (
                    <Cell key={`cell-inv-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
