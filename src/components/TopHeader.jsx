import React, { useState } from "react";
import {
  Menu,
  LogOut,
  User,
  Settings as SettingsIcon,
  Loader2,
  Save,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function TopHeader({ onMenuToggle }) {
  // --- STATES ---
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // State lưu trữ dữ liệu khi đang gõ
  const [editUsername, setEditUsername] = useState("");
  const [editThreshold, setEditThreshold] = useState(10);
  const [isSaving, setIsSaving] = useState(false);

  // --- STORES & ROUTING ---
  const { user, signOut, updateUserSetting } = useAuthStore();
  const navigate = useNavigate();

  const DEFAULT_AVATAR =
    "https://api.dicebear.com/7.x/avataaars/svg?seed=default";

  // Lấy dữ liệu user hiện tại
  const currentUser = {
    name: user?.username || "Guest User",
    email: user?.email || "user@example.com",
    avatar: DEFAULT_AVATAR,
    threshold: user?.lowStockThreshold || 10,
  };

  // --- HANDLERS ---
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/sign-in");
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  const handleOpenSettings = () => {
    setEditUsername(currentUser.name);
    setEditThreshold(currentUser.threshold);
    setIsSettingsOpen(true);
    setShowDropdown(false);
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      await updateUserSetting(editUsername, Number(editThreshold));
      toast.success("Cập nhật thành công");
      setIsSettingsOpen(false);
    } catch (error) {
      toast.error("Cập nhật thất bại");
      console.error("Lỗi khi lưu cài đặt:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors focus:outline-none"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Quản lý đơn hàng và sản phẩm
          </h1>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-2 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-100"
          >
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-bold text-gray-900 leading-none mb-1">
                {currentUser.name}
              </span>
              <span className="text-xs text-gray-500 font-medium leading-none">
                {currentUser.email}
              </span>
            </div>

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

          {/* Hộp Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-30">
              <div className="sm:hidden px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-900">
                  {currentUser.name}
                </p>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {currentUser.email}
                </p>
              </div>

              <button
                onClick={handleOpenSettings}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
              >
                <SettingsIcon className="w-4 h-4" />
                <span className="font-medium">Cài đặt</span>
              </button>

              <div className="h-px bg-gray-100 my-1"></div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Đăng xuất</span>
              </button>
            </div>
          )}

          {/* HỘP THOẠI CÀI ĐẶT TÀI KHOẢN */}
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Cài đặt tài khoản</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="username">Tên người dùng</Label>
                  <Input
                    id="username"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="threshold">
                    Ngưỡng cảnh báo sắp hết hàng
                  </Label>
                  <Input
                    id="threshold"
                    type="number"
                    min="1"
                    value={editThreshold}
                    onChange={(e) => setEditThreshold(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Hệ thống sẽ báo vàng nếu tồn kho dưới con số này.
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsSettingsOpen(false)}
                  disabled={isSaving}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleSaveSettings}
                  className="bg-black text-white min-w-[120px]"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Lưu cài đặt
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
