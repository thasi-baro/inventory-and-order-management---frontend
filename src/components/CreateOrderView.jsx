import React, { useState, useEffect } from "react";
import {
  Search,
  Package,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
} from "lucide-react";
import { useProductStore } from "@/stores/useProductStore";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "sonner";
import { z } from "zod";
import { useOrderStore } from "@/stores/useOrderStore";

//Ràng buộc khi nhập thông tin khách hàng
const createUserInfoSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên khách hàng"), // ko đc để trống
  phone: z
    .string()
    .regex(/^[0-9]*$/, "Số điện thoại chỉ được chứa chữ số") // phải nhập số
    .optional(),
  email: z.email("Vui lòng nhập email khách hàng hợp lệ"), // ko đc trống và phải là dạng email
});

export default function CreateOrderView() {
  // Các biến & STATEs
  const [searchQuery, setSearchQuery] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  // Stores
  const { products, fetchProducts } = useProductStore();
  const {
    cart,
    customer,
    setCustomer,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCartStore();
  const { createOrder, loading: isSubmitting } = useOrderStore();
  //EFFECTs
  // Timer điếm thời gian để gọi hàm tìm kiếm sau 0.5s user ngừng gõ
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 500); //0.5s
    return () => clearTimeout(timer);
  }, [localSearch]);

  //Gọi hàm tìm kiếm khi người dùng search và ngưng sau 0.5s
  useEffect(() => {
    fetchProducts(1, 20, searchQuery, "ALL");
  }, [searchQuery, fetchProducts]);
  //CÁC HÀM XỬ LÝ
  // Tính tổng tiền ở frontend (ko gửi xuống be)
  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  //Xử lí khi bấm tạo đơn hàng
  const handleCheckout = async (e) => {
    e.preventDefault(); //ngăn web tự load lại trang

    // Kiểm tra giỏ hàng
    if (cart.length === 0) {
      return toast.error("Vui lòng chọn ít nhất 1 sản phẩm!");
    }

    //Validate thông tin khách hàng được nhập bằng safeParse
    const validation = createUserInfoSchema.safeParse(customer);

    if (!validation.success) {
      // Nếu lỗi, Zod sẽ trả về mảng lỗi. Quét mảng đó và bắn Toast từng lỗi một
      validation.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
      return; // Dừng lại
    }

    try {
      //Format dữ liệu trước khi đưa xuống be
      const data = {
        customerInfo: customer,
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          unit_price: item.price,
        })),
      };

      //Gọi hàm tạo đơn hàng với dữ liệu vừa formatted
      const res = await createOrder(data);
      if (res) {
        //Thành công thì cập nhật lại trang để có dữ liueej mới nhất và xóa giỏ hàng để nhập tiếp cho khách hàng kế tiếp
        fetchProducts(1, 20, searchQuery, "ALL");
        clearCart();
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tạo đơn hàng, vui lòng thử lại!");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
      {/* Danh sách sản phẩm */}
      <div className="w-full lg:w-[65%] flex flex-col gap-4">
        {/* Thanh tìm kiếm */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm để thêm vào đơn..."
            className="w-full bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
            {products?.map((product) => (
              <div
                key={product._id}
                onClick={() => addToCart(product)}
                className={`relative bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col transition-all duration-200 
                  ${product.stock > 0 ? "cursor-pointer hover:shadow-md hover:border-black hover:-translate-y-1" : "opacity-60 grayscale cursor-not-allowed"}
                `}
              >
                <div className="h-32 bg-gray-50 flex justify-center items-center p-4 border-b border-gray-100">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full object-cover mix-blend-multiply"
                    />
                  ) : (
                    <Package className="w-10 h-10 text-gray-300" />
                  )}
                </div>

                <div className="p-3 flex flex-col flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                  <div className="mt-auto pt-3 flex items-end justify-between">
                    <span className="text-sm font-bold text-black">
                      {product.price.toLocaleString()}đ
                    </span>
                    <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                      Kho: {product.stock}
                    </span>
                  </div>
                </div>

                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full transform -rotate-12 shadow-lg">
                      HẾT HÀNG
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Giỏ hàng & thông tin khách hàng */}
      <div className="w-full lg:w-[35%]">
        <div className="sticky top-0 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col h-full max-h-full overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="font-bold text-lg text-black flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Chi tiết đơn hàng
            </h2>
            <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded-md">
              {cart.length} món
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3 mt-10">
                <ShoppingCart className="w-12 h-12 opacity-20" />
                <p className="text-sm">Chưa có sản phẩm nào</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-3 items-stretch border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  {/* Khối Ảnh */}
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-gray-200 shadow-sm shrink-0 p-1">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt="img"
                        className="h-full w-full object-cover p-1 mix-blend-multiply"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-gray-300" />
                    )}
                  </div>

                  {/* Khối Text và Button */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.price.toLocaleString()}đ / cái
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      {/* Box đếm số lượng */}
                      <div className="flex items-center bg-white border border-gray-200 rounded-md h-7 shadow-sm">
                        <button
                          onClick={() => updateQuantity(item._id, -1)}
                          className="w-7 h-full flex items-center justify-center hover:bg-gray-100 rounded-l-md transition-colors text-gray-600"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-semibold w-8 text-center border-x border-gray-100 h-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-7 h-full flex items-center justify-center hover:bg-gray-100 rounded-r-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-gray-600"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="h-7 w-7 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors border border-transparent hover:border-red-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Cột Tổng tiền */}
                  <div className="text-sm font-bold text-black shrink-0 self-start pt-0.5">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Form thông tin khách & Button đặt hàng */}
          <div className="border-t border-gray-200 bg-gray-50 p-4">
            <form onSubmit={handleCheckout} className="space-y-4">
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Thông tin khách hàng
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Tên khách *"
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({ ...customer, name: e.target.value })
                    }
                    className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                    className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email nhận mã đơn *"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({ ...customer, email: e.target.value })
                  }
                  className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="border-t border-dashed border-gray-300 my-2"></div>

              <div className="flex items-end justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Tổng cộng:
                </span>
                <span className="text-2xl font-black text-black">
                  {totalAmount.toLocaleString()}đ
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting} // Khóa nút khi đang gọi API
                className={`w-full text-white font-bold text-sm py-3.5 rounded-lg shadow-md transition-colors flex justify-center items-center gap-2 
      ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"}`}
              >
                {isSubmitting ? "ĐANG XỬ LÝ..." : "CHỐT ĐƠN HÀNG"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
