import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import React from "react";
import Logout from "@/auth/Logout";
import { toast } from "sonner";
import api from "@/lib/axios.js";
const HomePages = () => {
  //Chỉ lấy duy nhất trường user trong store tránh việc bị render lại khi component thay đổi
  const user = useAuthStore((s) => s.user);

  const handleOnClick = async () => {
    try {
      await api.get("/users/test", { withCredentials: true });
      toast.success("ok");
    } catch (error) {
      toast.error("loi");
      console.error(error);
    }
  };

  return (
    <div>
      {user?.username}
      <Logout />
      <Button onClick={handleOnClick}>test</Button>
    </div>
  );
};

export default HomePages;
