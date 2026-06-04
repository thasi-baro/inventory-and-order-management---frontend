// ==========================================
// 1. IMPORTS
// ==========================================
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
} from "lucide-react";

// Stores
import { useProductStore } from "@/stores/useProductStore";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2Icon } from "lucide-react";
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

// ==========================================
// 2. SCHEMAS (Ràng buộc dữ liệu đầu vào)
// ==========================================
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

// ==========================================
// 3. COMPONENT CHÍNH
// ==========================================
export default function ProductsView() {
  // --- STORES & STATES ---
  //State lưu ảnh user chọn
  const [selectedImage, setSelectedImage] = useState(null);
  // State quản lý đóng/mở Dialog add vaf edit
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // State quản lý đóng/mở Dialog delete
  const [isDialogOpenDelete, setIsDialogOpenDelete] = useState(false);
  // Quản lý nút edit
  const [editing, setEditing] = useState(null);
  //Id sản phẩm cần xóa
  const [deletedProductId, setDeletedProductId] = useState(null);
  //State lọc & tìm kiếm
  const [localSearch, setLocalSearch] = useState(""); // Chữ đang gõ trong ô input
  const [searchQuery, setSearchQuery] = useState(""); // Chữ chính thức đem đi tìm kiếm (khi bấm Enter)
  const [statusFilter, setStatusFilter] = useState("ALL"); // Trạng thái chọn trong Select box
  const [page, setPage] = useState(1); // Trang hiện tại
  const limit = 5; // Số sản phẩm trên 1 trang (Cố định)
  const [localFromPrice, setLocalFromPrice] = useState("");
  const [localToPrice, setLocalToPrice] = useState("");
  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(1000000000);

  //Biến & hàm lấy từ product store
  const {
    //Biến
    totalProducts: storeTotal,
    lowStockCount: storeLowStock,
    pagination,
    products,
    //Hàm
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
    fetchTotalAndLowStock,
  } = useProductStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createProductSchema),
  });

  // --- EFFECTS ---
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
  ]);

  useEffect(() => {
    //Chờ 0.5s sau khi user ngừng gõ tên sản phẩm
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
      setPage(1); //Đưa về trang 1
    }, 500); //0.5s

    return () => clearTimeout(timer);
  }, [localSearch]); //Chạy lại khi input thay đổi

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
    console.log(editing);
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
  // Xử lý Tìm kiếm
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setPage(1);
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
      {/* KHỐI THỐNG KÊ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Tổng sản phẩm hiện có
              </p>
              <h3 className="text-4xl font-extrabold text-gray-900 mt-2">
                {storeTotal}
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
                {storeLowStock}
                <span className="text-sm font-normal text-gray-500 tracking-normal">
                  sản phẩm cần chú ý
                </span>
              </h3>
            </div>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
        </div>
      </div>

      {/* THANH CÔNG CỤ (TÌM KIẾM, LỌC, THÊM SP) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Ô Tìm kiếm */}
          <Field orientation="horizontal">
            <Input
              type="search"
              placeholder="Nhập tên sản phẩm..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)} //Gán giá trị lên ô input
            />
          </Field>

          {/* Ô Lọc trạng thái */}
          <div className="relative w-full sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <Select onValueChange={handleFilterChange} value={statusFilter}>
              <SelectTrigger className="w-full pl-9 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-black focus:ring-offset-0 transition-colors">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="cursor-pointer">
                  Tất cả trạng thái
                </SelectItem>
                <SelectItem value="IN_STOCK" className="cursor-pointer">
                  Còn hàng (≥10)
                </SelectItem>
                <SelectItem value="LOW_STOCK" className="cursor-pointer">
                  Sắp hết (&lt;10)
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
              className="h-9 px-3 flex items-center justify-center bg-black text-white hover:bg-gray-800 rounded-md transition-colors shadow-sm shrink-0"
              title="Lọc theo giá"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Nút & Dialog Thêm Sản Phẩm */}
        <Button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-6 bg-black text-white text-sm font-medium rounded-md border border-black hover:bg-white hover:text-black transition-all duration-200 w-full md:w-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Thêm sản phẩm
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-sm">
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                </DialogTitle>
                <div className="min-h-[10px] mt-1"></div>
              </DialogHeader>

              <FieldGroup>
                <Field>
                  <Label htmlFor="name">
                    Tên sản phẩm<span className="text-destructive">*</span>
                  </Label>
                  <Input id="name" {...register("name")} />
                  <div className="min-h-[10px] mt-1">
                    {errors.name && (
                      <p className="text-destructive text-xs">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="description">Mô tả chi tiết</FieldLabel>
                  <Textarea
                    id="description"
                    placeholder="Nhập mô tả..."
                    {...register("description")}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="price">
                      Giá (VND)<span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input id="price" type="number" {...register("price")} />
                    <div className="min-h-[20px] mt-1">
                      {errors.price && (
                        <p className="text-destructive text-xs">
                          {errors.price.message}
                        </p>
                      )}
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="stock">
                      Số lượng<span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input id="stock" type="number" {...register("stock")} />
                    <div className="min-h-[20px] mt-1">
                      {errors.stock && (
                        <p className="text-destructive text-xs">
                          {errors.stock.message}
                        </p>
                      )}
                    </div>
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="image_url">Upload ảnh</FieldLabel>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                  />
                  <div className="min-h-[10px] mt-1"></div>
                </Field>
              </FieldGroup>

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                </DialogClose>
                <Button type="submit">Lưu thay đổi</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-2/5">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/5">
                  Giá
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/5">
                  Tồn kho
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/5">
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
                            : product.stock < 10
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
          <AlertDialogContent size="sm">
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
              <AlertDialogCancel variant="outline">Hủy</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => onDelete()}
              >
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* PHÂN TRANG: Đã bọc an toàn bằng ?. và sửa lỗi hàm handlePageChange */}
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
                        handlePageChange(pageNum); // Đã sửa thành handlePageChange
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
                        handlePageChange(pagination.currentPage + 1); // Đã sửa thành handlePageChange
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
