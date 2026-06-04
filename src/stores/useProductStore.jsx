import { create } from "zustand";
import { toast } from "sonner";
import { productService } from "@/services/productService";

export const useProductStore = create((set, get) => ({
  totalProducts: 0,
  lowStockCount: 0,
  loading: false,
  error: null,
  products: null,
  pagination: null,
  /**
   * Xóa trạng thái về giá trị mặc định
   */
  clearState: () => {
    set({ totalProducts: 0, lowStockCount: 0, loading: false, error: null });
  },

  /**
   * Lấy tổng số sản phẩm và số sản phẩm tồn kho thấp từ backend
   * @returns trạng thái lấy dữ liệu
   */
  fetchTotalAndLowStock: async () => {
    try {
      set({ loading: true, error: null });

      // Gọi API từ productService
      const data = await productService.totalAndLowStock();

      // Cập nhật state với dữ liệu nhận được
      set({
        totalProducts: data.total || 0,
        lowStockCount: data.lowStock || 0,
      });

      return { success: true };
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);

      // Lấy thông báo lỗi cụ thể từ backend
      const errorMessage =
        error.response?.data?.message || "Lỗi khi lấy dữ liệu sản phẩm";

      set({ error: errorMessage });
      toast.error(errorMessage);

      return { success: false };
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Cập nhật số lượng sản phẩm
   */
  setTotalProducts: (total) => {
    set({ totalProducts: total });
  },

  /**
   * Cập nhật số lượng sản phẩm tồn kho thấp
   */
  setLowStockCount: (count) => {
    set({ lowStockCount: count });
  },

  //Lấy các sản phẩm và phân trang , tìm kiếm
  fetchProducts: async (page, limit, search, status, fromPrice, toPrice) => {
    set({ loading: true, error: null });
    try {
      const res = await productService.getAllProducts(
        page,
        limit,
        search,
        status,
        fromPrice,
        toPrice,
      );

      set({ products: res.products, pagination: res.pagination });
      return { success: true };
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      const errorMessage =
        error.response?.data?.message || "Lỗi khi lấy danh sách sản phẩm";
      set({
        error: errorMessage,
      });
      toast.error(errorMessage);
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Lấy tổng số sản phẩm và số sản phẩm tồn kho thấp từ backend
   * @returns trạng thái lấy dữ liệu
   */
  createProduct: async (name, description, price, stock, image) => {
    try {
      set({ loading: true, error: null });

      // Gọi API từ productService
      await productService.createProduct(
        name,
        description,
        price,
        stock,
        image,
      );
      toast.success("Tạo sản phẩm thành công");
      return { success: true };
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm sản phẩm:", error);

      // Lấy thông báo lỗi cụ thể từ backend
      const errorMessage =
        error.response?.data?.message || "Lỗi khi tạo sản phẩm sản phẩm";

      set({ error: errorMessage });
      toast.error(errorMessage);

      return { success: false };
    } finally {
      set({ loading: false });
    }
  },
  /**
   * Lấy tổng số sản phẩm và số sản phẩm tồn kho thấp từ backend
   * @returns trạng thái lấy dữ liệu
   */
  updateProduct: async (id, name, description, price, stock, image) => {
    try {
      set({ loading: true, error: null });
      // Gọi API từ productService
      await productService.updateProduct(
        id,
        name,
        description,
        price,
        stock,
        image,
      );
      toast.success("Cập nhật sản phẩm thành công");
      return { success: true };
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);

      // Lấy thông báo lỗi cụ thể từ backend
      const errorMessage =
        error.response?.data?.message || "Lỗi khi cập nhật sản phẩm";

      set({ error: errorMessage });
      toast.error(errorMessage);

      return { success: false };
    } finally {
      set({ loading: false });
    }
  },
  /**
   * Lấy tổng số sản phẩm và số sản phẩm tồn kho thấp từ backend
   * @returns trạng thái lấy dữ liệu
   */
  deleteProduct: async (id) => {
    try {
      set({ loading: true, error: null });
      console.log("id", id);
      // Gọi API từ productService
      await productService.deleteProduct(id);
      toast.success("Xóa sản phẩm thành công");
      return { success: true };
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);

      // Lấy thông báo lỗi cụ thể từ backend
      const errorMessage =
        error.response?.data?.message || "Lỗi khi cập nhật sản phẩm";

      set({ error: errorMessage });
      toast.error(errorMessage);

      return { success: false };
    } finally {
      set({ loading: false });
    }
  },
}));
