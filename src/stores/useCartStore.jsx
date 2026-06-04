import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  //Các biến lưu dữ liệu
  cart: [],
  customer: { name: "", email: "", phone: "" },

  //lưu thông tin khách hàng đã nhập
  setCustomer: (customerInfo) => set({ customer: customerInfo }),

  //Các hàm xử lí
  //Thêm 1 sản phẩm vào giỏ
  addToCart: (product) => {
    const { cart } = get();
    if (product.stock === 0) return; //Kho rỗng thì ko làm gì

    //Lấy các sản phẩm trong giỏ
    const existingItem = cart.find((item) => item._id === product._id);
    if (existingItem) {
      //Nếu đã có trong giỏ
      if (existingItem.quantity >= product.stock) return; //Vượt số lượng thì ko cho tăng nữa

      set({
        cart: cart.map((item) =>
          //Tăng số lượng lên nếu đã có trong giỏ rồi
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      });
    } else {
      //Nếu chưa có -> thêm mới vào giỏ với số lượng là 1
      set({ cart: [...cart, { ...product, quantity: 1 }] });
    }
  },

  //Tăng/giảm số lượng sản phẩm trong giỏ
  updateQuantity: (productId, delta) => {
    const { cart } = get();
    set({
      cart: cart.map((item) => {
        if (item._id === productId) {
          //Sản phẩm đã chọn
          const newQuantity = item.quantity + delta; //Số lượng mới = số lượng hiện tại +/- 1
          //Chỉ cập nhật nếu số lượng > 0 & <= số tồn kho
          if (newQuantity > 0 && newQuantity <= item.stock) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      }),
    });
  },

  //Xóa hẳn 1 sản phẩm ra khỏi cart
  removeFromCart: (productId) => {
    const { cart } = get();
    // Chỉ giữ lại những sp khác id với sp bị xóa
    set({ cart: cart.filter((item) => item._id !== productId) });
  },

  // Xóa sạch giỏ hàng khi tạo đơn thành công
  clearCart: () => {
    set({
      cart: [],
      customer: { name: "", email: "", phone: "" },
    });
  },
}));
