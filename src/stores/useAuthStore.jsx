import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";

export const useAuthStore = create((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },

  /**
   * Hàm đăng ký
   * @param {*} username
   * @param {*} email
   * @param {*} password
   * @returns trạng thái đăng ký (thành công/thất bại)
   */
  signUp: async (username, email, password) => {
    try {
      set({ loading: true });

      //gọi api xuống be thông qua auth Service
      await authService.signUp(username, email, password);

      toast.success("Đăng ký thành công. Vui lòng đăng nhập");
      return { success: true }; //trả success để cho phép navigate qua đăng nhập
    } catch (error) {
      console.error(error);
      // Lấy thông báo lỗi cụ thể từ backend
      const errorMessage =
        error.response?.data?.message || "Đăng ký không thành công";
      toast.error(errorMessage);
      return { success: false }; //trả không success để không cho phép navigate qua đăng nhập
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Đăng nhập
   * @param {*} email
   * @param {*} password
   * @returns Trạng thái đăng nhập (thành công/thất bại)
   */
  signIn: async (email, password) => {
    try {
      set({ loading: true });

      //lấy access token từ be gửi lên
      const { accessToken } = await authService.signIn(email, password);
      get().setAccessToken(accessToken); //gán access token

      //lấy thông tin user đã đăng nhập
      await get().fetchMe();

      toast.success("Đăng nhập thành công");
      return { success: true };
    } catch (error) {
      console.error(error);
      // Lấy thông báo lỗi cụ thể từ backend
      const errorMessage =
        error.response?.data?.message || "Đăng nhập không thành công";
      toast.error(errorMessage);
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Đăng xuất - xóa trạng thái đăng nhập , các token
   */
  signOut: async () => {
    try {
      await authService.signOut();
      get().clearState(); //xóa state
      toast.success("Đăng xuất thành công!");
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message || "Lỗi xảy ra khi đăng xuất!";
      toast.error(errorMessage);
    }
  },

  /**
   * Lấy thông tin user
   * @returns user
   */
  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();

      set({ user });
    } catch (error) {
      console.error(error);
      set({ user: null, accessToken: null });
      toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng");
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Refresh token nếu còn hạn
   */
  refresh: async () => {
    try {
      set({ loading: true });
      const { user, fetchMe, setAccessToken } = get(); //Lấy user để kiểm tra
      //Lấy access token từ be
      const accessToken = await authService.refresh();

      setAccessToken(accessToken); //gán access token

      if (!user) {
        //nếu ko có user thì lấy lại
        await fetchMe();
      }
    } catch (error) {
      console.error(error);
      toast.error("Phiên đăng nhập đã hết hạn.Vui lòng đăng nhập lại");
      get().clearState();
    } finally {
      set({ loading: false });
    }
  },
}));
