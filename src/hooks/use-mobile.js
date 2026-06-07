import * as React from "react"

// Đặt mốc kích thước cho giao diện mobile 
const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // State lưu trữ trạng thái hiện 
  const [isMobile, setIsMobile] = React.useState(undefined)

  React.useEffect(() => {
    // Tạo một media query để kiểm tra màn hình có chiều rộng max là 767px không
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // Hàm xử lý khi kích thước màn hình thay đổi 
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Lắng nghe sự kiện thay đổi kích thước
    mql.addEventListener("change", onChange)

    // Set giá trị khởi tạo lần đầu tiên khi component vừa render
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Xóa bộ lắng nghe khi component bị hủy để tránh rò rỉ bộ nhớ
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}