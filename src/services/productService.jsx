import api from "@/lib/axios";

//Gọi api xuống backend
export const productService = {
  //Gọi total and low stock api
  totalAndLowStock: async () => {
    const res = await api.get("products/count", { withCredentials: true });

    return res.data;
  },

  //Lấy danh sách sản phẩm có phân trang
  getAllProducts: async (
    page = 1,
    limit = 5,
    search = "",
    status = "ALL",
    fromPrice = 0,
    toPrice = 1000000000,
  ) => {
    const res = await api.get(
      "products",
      {
        params: {
          page: page,
          limit: limit,
          search: search,
          status: status,
          fromPrice,
          toPrice,
        },
      },
      { withCredentials: true },
    );
    return res.data;
  },

  //Tạo sản phẩm
  createProduct: async (name, description, price, stock, image) => {
    //Sử dụng formdata thay vì json
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description || "");
    formData.append("price", price);
    formData.append("stock", stock);

    if (image) {
      formData.append("image", image);
    }
    const res = await api.post("products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return res.data;
  },
  //Tạo sản phẩm
  updateProduct: async (id, name, description, price, stock, image) => {
    //Sử dụng formdata thay vì json
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description || "");
    formData.append("price", price);
    formData.append("stock", stock);

    if (image) {
      formData.append("image", image);
    }
    console.log(formData);
    const res = await api.put(`products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return res.data;
  },
  //Xóa sản phẩm
  deleteProduct: async (id) => {
    const res = await api.delete(`products/${id}`, {
      withCredentials: true,
    });
    return res.data;
  },
};
