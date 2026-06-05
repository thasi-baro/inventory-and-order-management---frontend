import api from "@/lib/axios.js";

//Gọi tới các hàm ở backend
export const authService = {
  //Đăng ký
  signUp: async (username, email, password) => {
    const res = await api.post(
      "auth/sign-up", //api endpoint
      { username, email, password }, //tham số
      { withCredentials: true }, //gửi thông tin user
    );

    return res.data;
  },
  //Đăng nhập
  signIn: async (email, password) => {
    const res = await api.post(
      "auth/sign-in",
      { email, password },
      { withCredentials: true },
    );

    return res.data; //trả về access token
  },
  //Đăng xuất
  signOut: async () => {
    return api.post("/auth/sign-out", {}, { withCredentials: true });
  },
  //Lấy thông tin user đang đăng nhập
  fetchMe: async () => {
    const res = await api.get("/users/me", {}, { withCredentials: true });

    return res.data.user;
  },
  //Refresh lại token khi hết
  refresh: async () => {
    const res = await api.post("/auth/refresh", {}, { withCredentials: true });
    return res.data.accessToken;
  },

  //Update thông tin user
  updateUser: async (username, lowStockThreshold) => {
    const res = await api.put(
      "/users/",
      {
        username,
        lowStockThreshold,
      },
      { withCredentials: true },
    );
    return res.data;
  },
};
