import { useAuthStore } from "@/stores/useAuthStore";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

//Route bảo vệ giúp kiểm tra user đăng nhập chưa, nếu rồi mới cho vào
const ProtectedRoute = () => {
  const { accessToken, user, loading, refresh, fetchMe } = useAuthStore(); //lấy thông tin từ useAuthStore đã định nghĩa
  const [starting, setStarting] = useState(true);
  //khởi tạo khi người dùng load trang
  const init = async () => {
    //xử lý rủi ro mất State khi user reload page
    if (!accessToken) {
      // mất token -> xin token mới từ backend
      await refresh();
    }

    const currentToken = useAuthStore.getState().accessToken; //lấy token hiện tại
    if (currentToken && !user) {
      //có token nhưng mất user info -> lấy lại profile user
      await fetchMe();
    }
    //Hoàn tất việc kiểm tra
    setStarting(false);
  };

  useEffect(() => {
    //gọi init
    init();
  }, []);

  if (starting || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải trang...
      </div>
    );
  }

  // Kiểm tra lại token sau khi refresh
  if (!accessToken) {
    //Nếu chưa đăng nhập
    return (
      <Navigate
        to="/sign-in" //chuyển đến trang đăng nhập
        replace // không cho quay lại trang trước vì đó là trang đc bảo vệ
      />
    );
  }

  return (
    <Outlet></Outlet> //hiển thị các route con
  );
};

export default ProtectedRoute;
