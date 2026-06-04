import React, { useState } from "react";
import { Menu, LogOut, User } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
export default function TopHeader({ onMenuToggle }) {
  // State quản lý việc ẩn/hiện menu dropdown khi bấm vào avatar
  const [showDropdown, setShowDropdown] = useState(false);
  // Lấy user từ authStore
  const user = useAuthStore((state) => state.user);
  //Gọi sign out từ authStore
  const { signOut } = useAuthStore();
  const navigate = useNavigate(); //sign out xong chuyển về trang sign in
  //Hàm xử lý sign out
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/sign-in"); //về trang đăng nhập
    } catch (error) {
      console.error(error);
    }
  };
  // Ảnh mặc định cho user
  const DEFAULT_AVATAR =
    "https://api.dicebear.com/7.x/avataaars/svg?seed=default";

  // Chuẩn bị thông tin user để hiển thị
  const currentUser = {
    name: user?.username || "Guest User",
    email: user?.email || "user@example.com",
    avatar: DEFAULT_AVATAR, // Luôn dùng ảnh mặc định
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Nửa bên trái: Nút Menu (Mobile) & Tiêu đề */}
        <div className="flex items-center gap-4">
          {/* Nút Hamburger menu chỉ hiện trên mobile để mở Sidebar */}
          <button
            onClick={onMenuToggle}
            className="md:hidden p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors focus:outline-none"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Inventory Management
          </h1>
        </div>

        {/* Nửa bên phải: User Profile & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-2 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-100"
          >
            {/* Cụm Text Info - Dùng hidden sm:flex để ẨN trên điện thoại, HIỆN trên tablet/PC */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-bold text-gray-900 leading-none mb-1">
                {currentUser.name}
              </span>
              <span className="text-xs text-gray-500 font-medium leading-none">
                {currentUser.email}
              </span>
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-200 border border-gray-300 overflow-hidden shrink-0 flex items-center justify-center">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </button>

          {/* Hộp Dropdown Menu (Hiển thị khi click) */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-30">
              {/* Phần text info dự phòng cho Mobile (khi ở ngoài nó bị ẩn thì vào trong dropdown sẽ thấy) */}
              <div className="sm:hidden px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-900">
                  {currentUser.name}
                </p>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {currentUser.email}
                </p>
              </div>

              <button className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Profile Settings</span>
              </button>

              <div className="h-px bg-gray-100 my-1"></div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
