import React, { useState } from "react";
import {
  LayoutGrid,
  Package,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  ClipboardList,
} from "lucide-react";

export default function Sidebar({ activeTab = "dashboard", onTabChange }) {
  //mặc định vào trang dashboard
  //State  quản lý đóng mở
  const [openMenus, setOpenMenus] = useState({ orders: true });

  // Hàm đảo trạng thái đóng/mở
  const toggleMenu = (menuId) => {
    setOpenMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  // Cấu trúc các trang và tên trang
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "products", label: "Sản phẩm", icon: Package },
    {
      id: "orders",
      label: "Đơn hàng",
      icon: ShoppingCart,
      //Order có 2 trang con
      subItems: [
        { id: "create_order", label: "Tạo đơn hàng", icon: PlusCircle },
        { id: "order_list", label: "Chi tiết đơn hàng", icon: ClipboardList },
      ],
    },
  ];

  return (
    <aside className="w-56 h-screen bg-[#F8F9FA] border-r border-gray-200 flex flex-col bg-slate-50">
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-lg font-bold text-xl">
          E
        </div>
        <div className="flex flex-col">
          <h2 className="text-[17px] font-bold text-gray-900 leading-tight">
            E Store
          </h2>
          <span className="text-[11px] text-gray-500 font-medium">
            Enterprise v1.0
          </span>
        </div>
      </div>

      {/* Khối Navigation Menu */}
      <nav className="flex flex-col mt-2">
        {navItems.map((item) => {
          const hasSubItems = !!item.subItems;
          const Icon = item.icon;

          // Kiểm tra xem menu cha CÓ đang chứa menu con nào được active không
          const isChildActive =
            hasSubItems && item.subItems.some((sub) => sub.id === activeTab);

          // Menu cha sáng lên khi chính nó active, hoặc khi menu con của nó active
          const isActive = activeTab === item.id || isChildActive;

          return (
            <div key={item.id}>
              <button
                // Nếu có menu con thì bấm vào là Tắt/Mở, nếu không có thì là Đổi Tab
                onClick={() =>
                  hasSubItems ? toggleMenu(item.id) : onTabChange(item.id)
                }
                className={`
                  flex items-center gap-3 px-6 py-3.5 w-full text-left transition-colors
                  ${
                    isActive
                      ? "bg-gray-200/60 border-l-4 border-black text-black font-semibold"
                      : "border-l-4 border-transparent text-gray-600 hover:bg-gray-100 hover:text-black"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-black" : "text-gray-500"}`}
                />
                <span className="text-sm flex-1">{item.label}</span>

                {hasSubItems && (
                  <span className="text-gray-400">
                    {openMenus[item.id] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </span>
                )}
              </button>
              {/* Menu con */}
              {hasSubItems && openMenus[item.id] && (
                <div className="bg-gray-50/50 py-1 border-y border-gray-100">
                  {item.subItems.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = activeTab === subItem.id;

                    return (
                      <button
                        key={subItem.id}
                        onClick={() => onTabChange(subItem.id)}
                        className={`
                          flex items-center gap-3 pl-11 pr-6 py-2.5 w-full text-left transition-colors text-sm
                          ${
                            isSubActive
                              ? "text-black font-bold bg-gray-100/50"
                              : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                          }
                        `}
                      >
                        <SubIcon
                          className={`w-4 h-4 ${isSubActive ? "text-black" : "text-gray-400"}`}
                        />
                        {subItem.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
