import React, { useState, useMemo } from "react";
import Sidebar from "@/components/SideBar";
import DashboardView from "@/components/DashBoardView";
import TopHeader from "../components/TopHeader";
import ProductsView from "@/components/ProductView";
import OrdersView from "@/components/OrderView.jsx";
import CreateOrderView from "@/components/CreateOrderView";

export default function Page() {
  const [currentTab, setCurrentTab] = useState("dashboard"); // lấy tab hiện tại để thực hiện chuyển tab
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // quản lý đóng mở sidebar trên điện thoại
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar Desktop */}
      <div className="hidden md:block">
        <Sidebar activeTab={currentTab} onTabChange={setCurrentTab} />
      </div>

      {/* Sidebar Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative z-50 h-full shadow-xl">
            <Sidebar
              activeTab={currentTab}
              onTabChange={(tab) => {
                setCurrentTab(tab);
                setIsMobileMenuOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Nội dung chính */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopHeader
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* TAB DASHBOARD */}
          {currentTab === "dashboard" && <DashboardView />}
          {/* TAB PRODUCTS */}
          {currentTab === "products" && <ProductsView />}
          {/* TAB PRODUCTS */}
          {currentTab === "create_order" && <CreateOrderView />}
          {currentTab === "order_list" && <OrdersView />}
        </main>
      </div>
    </div>
  );
}
