import api from "@/lib/axios.js";

export const authService = {
  //Gọi tới api sign up ở backend
  signUp: async (username, email, password) => {
    const res = await api.post(
      "auth/sign-up", //api endpoint
      { username, email, password }, //tham số
      { withCredentials: true },
    );

    return res.data;
  },

  signIn: async (email, password) => {
    const res = await api.post(
      "auth/sign-in",
      { email, password },
      { withCredentials: true },
    );

    return res.data; //trả về access token
  },

  signOut: async () => {
    return api.post("/auth/sign-out", {}, { withCredentials: true });
  },

  fetchMe: async () => {
    const res = await api.get("/users/me", {}, { withCredentials: true });

    return res.data.user;
  },

  refresh: async () => {
    const res = await api.post("/auth/refresh", {}, { withCredentials: true });
    return res.data.accessToken;
  },
};
