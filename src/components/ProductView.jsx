import React, { useState, useEffect } from "react";
import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Package,
  AlertTriangle,
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  X,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2Icon, Save, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Stores
import { useProductStore } from "@/stores/useProductStore";
import { useAuthStore } from "@/stores/useAuthStore";
//Ràng buộc khi nhập tạo/ sửa dữ liệu sản phẩm
const createProductSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên sản phẩm"),
  description: z.string().optional(), //không bắt buộc
  //dùng .pipe để ép ko đc bỏ trống vừa yêu cầu ko âm
  price: z
    .string()
    .min(1, "Vui lòng nhập giá tiền")
    .pipe(z.coerce.number().min(0, "Giá không được là số âm")),

  stock: z
    .string()
    .min(1, "Vui lòng nhập số lượng")
    .pipe(z.coerce.number().min(0, "Số lượng không được âm")),
});

export default function ProductsView() {
  //STATEs
  const [selectedImage, setSelectedImage] = useState(null); //State lưu ảnh user chọn
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State quản lý đóng/mở Dialog add vaf edit
  const [isDialogOpenDelete, setIsDialogOpenDelete] = useState(false); // State quản lý đóng/mở Dialog delete
  const [editing, setEditing] = useState(null); // Quản lý nút edit
  const [deletedProductId, setDeletedProductId] = useState(null); //Id sản phẩm cần xóa
  //State lọc & tìm kiếm
  const [localSearch, setLocalSearch] = useState(""); // Chữ đang gõ trong ô input
  const [searchQuery, setSearchQuery] = useState(""); // Chữ chính thức đem đi tìm kiếm (khi bấm Enter)
  const [statusFilter, setStatusFilter] = useState("ALL"); // Trạng thái chọn trong Select box
  const [page, setPage] = useState(1); // Trang hiện tại
  const limit = 5; // Số sản phẩm trên 1 trang (Cố định)
  const [localFromPrice, setLocalFromPrice] = useState("");
  const [localToPrice, setLocalToPrice] = useState("");
  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(1000000000); //Mặc định giá cao nhất 1 tỷ để hiển thị toàn bộ sản phẩm

  //STOREs
  const {
    //Biến
    totalProducts,
    lowStockCount,
    pagination,
    products,
    //Hàm
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
    fetchTotalAndLowStock,
  } = useProductStore();

  //Lấy ngưỡng mà user tùy chỉnhconst
  const { user } = useAuthStore();
  const lowStockThreshold = user?.lowStockThreshold || 10;
  //Ràng buộc
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createProductSchema),
  });

  //EFFECTs
  // Tự động lấy thống kê khi load trang
  useEffect(() => {
    //Api thống kê
    fetchTotalAndLowStock();
    //APi lấy danh sách & lọc
    fetchProducts(page, limit, searchQuery, statusFilter, fromPrice, toPrice);
  }, [
    page,
    limit,
    searchQuery,
    statusFilter,
    fromPrice,
    toPrice,
    fetchTotalAndLowStock,
    fetchProducts,
    lowStockThreshold,
  ]);

  useEffect(() => {
    //Chờ 0.5s sau khi user ngừng gõ tên sản phẩm
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
      setPage(1); //Đưa về trang 1
    }, 500); //0.5s

    return () => clearTimeout(timer);
  }, [localSearch]); //Chạy lại khi input thay đổi

  //CÁC HÀM XỬ LÝ
  //Lọc theo giá
  const handleApplyPriceFilter = () => {
    setFromPrice(localFromPrice);
    setToPrice(localToPrice);
    setPage(1); // Luôn ép về trang 1 khi áp dụng bộ lọc mới
  };

  //Xử lý dialog add/edit product
  const handleOpenAdd = () => {
    setEditing(null); // Báo hiệu là Thêm mới
    setSelectedImage(null); // Xóa ảnh đang chọn tạm
    reset({ name: "", description: "", price: "", stock: "" }); // Xóa sạch các ô text
    setIsDialogOpen(true); // Bật Dialog lên
  };
  const handleOpenEdit = (product) => {
    setEditing(product); // Lưu thông tin sản phẩm đang bấm vào
    setSelectedImage(null); // Xóa ảnh mới

    reset({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
    });

    setIsDialogOpen(true); // Bật Dialog lên
  };

  //Xử lý xóa sản phẩm
  const handleDelete = (productId) => {
    setDeletedProductId(productId);
    setIsDialogOpenDelete(true);
  };

  // Xử lý Thêm/Sửa sản phẩm
  const onSubmit = async (data) => {
    let res;
    if (editing) {
      //Nếu là edit thì gán các giá trị vô để hiển thị
      res = await updateProduct(
        editing._id, // Truyền ID để backend biết sửa cái nào
        data.name,
        data.description,
        data.price,
        data.stock,
        selectedImage, // Nếu selectedImage là null, thì ko đổi ảnh
      );
    } else {
      res = await createProduct(
        data.name,
        data.description,
        data.price,
        data.stock,
        selectedImage,
      );
    }

    // Nếu thành công thì đóng form và tải lại bảng
    if (res && res.success) {
      reset();
      setSelectedImage(null);
      fetchTotalAndLowStock();
      fetchProducts(page, limit, searchQuery, statusFilter, fromPrice, toPrice);
      setIsDialogOpen(false);

      const fileInput = document.getElementById("image");
      if (fileInput) fileInput.value = "";
    }
  };

  const onDelete = async () => {
    const res = await deleteProduct(deletedProductId);

    if (res.success) {
      //Cập nhật số lượng sau khi xóa và đóng dialog
      fetchProducts(page, limit, searchQuery, statusFilter, fromPrice, toPrice);
      fetchTotalAndLowStock();
      setIsDialogOpenDelete(false);
    }
  };

  // Xử lý Bộ lọc (Filter)
  const handleFilterChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  //Xử lý chuyển trang
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Xử lý Phân trang (Tạo danh sách số trang cho UI)
  const getPageNumbers = () => {
    if (!pagination) return [];

    const pages = [];
    const maxVisiblePages = 3;

    const current = pagination.currentPage || 1;
    const total = pagination.totalPages || 1;

    let start = Math.max(1, current - 1);
    let end = Math.min(total, start + maxVisiblePages - 1);

    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Khối thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Tổng sản phẩm hiện có
              </p>
              <h3 className="text-4xl font-extrabold text-gray-900 mt-2">
                {totalProducts}
              </h3>
            </div>
            <Package className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Sản phẩm tồn kho sắp hết
              </p>
              <h3 className="text-4xl font-extrabold text-gray-900 mt-2 flex items-baseline gap-2">
                {lowStockCount}
                <span className="text-sm font-normal text-gray-500 tracking-normal">
                  sản phẩm cần chú ý
                </span>
              </h3>
            </div>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
        </div>
      </div>
      {/* Thanh công cụ (tìm kiếm lọc & thêm sản phẩm) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Ô Tìm kiếm */}
          <Field orientation="horizontal">
            <Input
              type="search"
              placeholder="Nhập tên sản phẩm..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </Field>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm font-medium text-gray-700 hidden sm:block whitespace-nowrap">
              Lọc theo trạng thái:
            </span>

            <div className="relative w-full sm:w-48">
              {/* Icon Filter */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>

              {/* Select Dropdown */}
              <Select onValueChange={handleFilterChange} value={statusFilter}>
                <SelectTrigger className="w-full pl-9 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ALL" className="cursor-pointer">
                    Tất cả trạng thái
                  </SelectItem>
                  <SelectItem value="IN_STOCK" className="cursor-pointer">
                    Còn hàng (&gt; {lowStockThreshold})
                  </SelectItem>
                  <SelectItem value="LOW_STOCK" className="cursor-pointer">
                    Sắp hết (&lt; {lowStockThreshold})
                  </SelectItem>
                  <SelectItem
                    value="OUT_OF_STOCK"
                    className="cursor-pointer text-red-600 focus:text-red-700"
                  >
                    Hết hàng (0)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm font-medium text-gray-500 whitespace-nowrap hidden lg:block">
              Giá:
            </span>
            <Input
              type="number"
              min="0"
              placeholder="Từ..."
              value={localFromPrice}
              onChange={(e) => setLocalFromPrice(e.target.value)}
              className="w-full sm:w-24 lg:w-32 bg-gray-50 focus:bg-white"
            />
            <span className="text-gray-400">-</span>
            <Input
              type="number"
              min="0"
              placeholder="Đến..."
              value={localToPrice}
              onChange={(e) => setLocalToPrice(e.target.value)}
              className="w-full sm:w-24 lg:w-32 bg-gray-50 focus:bg-white"
            />
            <button
              onClick={handleApplyPriceFilter}
              className="h-8 px-3 flex items-center justify-center bg-black text-white hover:bg-gray-800 rounded-md transition-colors shadow-sm shrink-0"
              title="Lọc theo giá"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Nút & Dialog Thêm Sản Phẩm */}
        <Button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1 px-5 py-6 bg-black text-white text-sm font-medium rounded-md border border-black hover:bg-white hover:text-black transition-all duration-200 w-full md:w-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Thêm sản phẩm
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[450px] p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader className="mb-5">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {editing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5">
                {/* Tên sản phẩm */}
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="VD: iPhone 15 Pro Max..."
                    {...register("name")}
                    // Đổi màu viền thành đỏ nếu có lỗi
                    className={
                      errors.name
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs font-medium">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Mô tả chi tiết */}
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="description"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Mô tả chi tiết
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Nhập mô tả sản phẩm..."
                    {...register("description")}
                    className="resize-none h-24" // Cố định chiều cao, không cho kéo dãn làm hỏng layout
                  />
                </div>

                {/* Giá và Số lượng (Chia 2 cột) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="price"
                      className="text-sm font-bold text-gray-700"
                    >
                      Giá (VND){" "}
                      <span className="text-red-500 font-bold">*</span>
                    </label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0"
                      {...register("price")}
                      className={
                        errors.price
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }
                    />
                    {errors.price && (
                      <p className="text-red-500 text-xs font-medium">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="stock"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Số lượng <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="0"
                      {...register("stock")}
                      className={
                        errors.stock
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }
                    />
                    {errors.stock && (
                      <p className="text-red-500 text-xs font-medium">
                        {errors.stock.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Upload Ảnh */}
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="image"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Upload ảnh
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                    className="cursor-pointer file:cursor-pointer file:bg-gray-100 file:text-gray-700 file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 file:text-sm file:font-semibold hover:file:bg-gray-200 transition-colors text-gray-500"
                  />
                </div>
              </div>

              {/* FOOTER */}
              <DialogFooter className="mt-8 pt-4 border-t border-gray-100">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="rounded-sm"
                  >
                    <X />
                    Hủy
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-black rounded-sm hover:bg-gray-800 text-white min-w-[120px]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Lưu {editing ? "thay đổi" : "mới"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-2/5">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider w-1/5">
                  Giá
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider w-1/5">
                  Tồn kho
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider w-1/5">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {products?.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded border border-gray-200 overflow-hidden flex items-center justify-center">
                          {product.image_url ? (
                            <img
                              className="h-full w-full object-cover"
                              src={product.image_url}
                              alt={product.name}
                            />
                          ) : (
                            <Package className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">
                            {product.name}
                          </div>
                          <div className="hidden sm:block text-xs text-gray-500 mt-0.5 truncate max-w-[250px]">
                            {product.description || "Chưa có mô tả"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-mono font-medium text-gray-900">
                        {product.price.toLocaleString()}đ
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs font-bold rounded-md ${
                          product.stock === 0
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : product.stock < lowStockThreshold
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-sm font-medium text-gray-900">
                      Không tìm thấy sản phẩm
                    </h3>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <AlertDialog
          open={!!deletedProductId && isDialogOpenDelete}
          onOpenChange={(isOpen) => !isOpen && setDeletedProductId(null)}
        >
          <AlertDialogContent size="sm" className="rounded-sm">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                <Trash2Icon />
              </AlertDialogMedia>
              <AlertDialogTitle>Bạn chắc chưa?</AlertDialogTitle>
              <AlertDialogDescription>
                Sản phẩm này sẽ bị xóa khỏi cơ sở dữ liệu và không thể phục hồi
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="outline" className="rounded-sm">
                <X />
                Hủy
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => onDelete()}
                className="rounded-sm"
              >
                <Trash2 />
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {pagination?.totalItems > 0 && pagination?.totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="hidden md:block">
              <p className="text-xs text-gray-500">
                Trang{" "}
                <span className="font-semibold text-gray-900">
                  {pagination.currentPage}
                </span>{" "}
                /{" "}
                <span className="font-semibold text-gray-900">
                  {pagination.totalPages}
                </span>
              </p>
            </div>

            <Pagination className="justify-end w-full md:w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) handlePageChange(page - 1);
                    }}
                    className={
                      page === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {pagination.currentPage > 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {getPageNumbers().map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      isActive={pageNum === pagination.currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNum);
                      }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {pagination.currentPage < pagination.totalPages - 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.currentPage < pagination.totalPages)
                        handlePageChange(pagination.currentPage + 1);
                    }}
                    className={
                      pagination.currentPage === pagination.totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
