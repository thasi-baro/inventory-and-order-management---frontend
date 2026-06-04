import React from "react";
import { Download, Plus } from "lucide-react";

export default function DashboardHeader({ onExport, onAddProduct }) {
  return (
    // Dùng flex-col cho mobile, sm:flex-row cho màn hình lớn, thêm mb-6 để tạo khoảng cách với các thẻ biểu đồ bên dưới
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      {/* Nửa trái: Tiêu đề và Mô tả */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Dashboard Overview
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Real-time metrics for current inventory and sales.
        </p>
      </div>

      {/* Nửa phải: Cụm nút thao tác */}
      <div className="flex items-center gap-3">
        {/* Nút Add Product (Nền đen, chữ trắng nổi bật) */}
        <button
          onClick={onAddProduct}
          className="flex items-center gap-2 px-4 py-2 bg-black border border-transparent text-sm font-medium text-white hover:bg-gray-800 rounded-md shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>
    </div>
  );
}
