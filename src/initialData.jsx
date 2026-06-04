export const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "Logitech MX Master 3S",
    sku: "LOG-MX3S-GRY",
    category: "Peripherals",
    price: 99,
    stock: 145,
    lowStockThreshold: 20,
    unitsSold: 420,
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "prod-2",
    name: 'MacBook Pro 16" M3',
    sku: "AAPL-MBP16-M3",
    category: "Computers",
    price: 2499,
    stock: 24,
    lowStockThreshold: 5,
    unitsSold: 315,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "prod-3",
    name: 'Dell UltraSharp 27"',
    sku: "DELL-U2723QE",
    category: "Displays",
    price: 549,
    stock: 82,
    lowStockThreshold: 10,
    unitsSold: 280,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "prod-4",
    name: "iPad Air M2",
    sku: "AAPL-IPAD-M2",
    category: "Tablets",
    price: 599,
    stock: 5, // Low stock!
    lowStockThreshold: 8,
    unitsSold: 190,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "prod-5",
    name: "Keychron Q1 Pro Mechanical Keyboard",
    sku: "KEYC-Q1P-BRN",
    category: "Peripherals",
    price: 199,
    stock: 0, // Out of stock!
    lowStockThreshold: 15,
    unitsSold: 145,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "prod-6",
    name: "Sony WH-1000XM5 Headphones",
    sku: "SONY-WH1000XM5",
    category: "Audio",
    price: 399,
    stock: 45,
    lowStockThreshold: 12,
    unitsSold: 110,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "prod-7",
    name: "Samsung T7 Shield 2TB SSD",
    sku: "SAMS-T7S-2TB",
    category: "Storage",
    price: 169,
    stock: 120,
    lowStockThreshold: 25,
    unitsSold: 95,
    image:
      "https://images.unsplash.com/photo-1597872200969-2b65dffc3a3c?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
];

export const INITIAL_ORDERS = [
  {
    id: "ORD-9421",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.j@electrostock.com",
    products: [
      {
        productId: "prod-2",
        productName: 'MacBook Pro 16" M3',
        quantity: 1,
        priceAtOrder: 2499,
      },
      {
        productId: "prod-1",
        productName: "Logitech MX Master 3S",
        quantity: 1,
        priceAtOrder: 99,
      },
    ],
    totalAmount: 2598,
    status: "Completed",
    date: "2026-06-01",
    trackingNumber: "TRK-98236149",
  },
  {
    id: "ORD-9420",
    customerName: "Alex Mercer",
    customerEmail: "alex.m@electrostock.com",
    products: [
      {
        productId: "prod-3",
        productName: 'Dell UltraSharp 27"',
        quantity: 2,
        priceAtOrder: 549,
      },
    ],
    totalAmount: 1098,
    status: "Pending",
    date: "2026-06-02",
    trackingNumber: "TRK-55239102",
  },
  {
    id: "ORD-9419",
    customerName: "Michael Chen",
    customerEmail: "mchen@electrostock.com",
    products: [
      {
        productId: "prod-6",
        productName: "Sony WH-1000XM5 Headphones",
        quantity: 1,
        priceAtOrder: 399,
      },
      {
        productId: "prod-5",
        productName: "Keychron Q1 Pro Mechanical Keyboard",
        quantity: 1,
        priceAtOrder: 199,
      },
    ],
    totalAmount: 598,
    status: "Completed",
    date: "2026-05-31",
    trackingNumber: "TRK-88123953",
  },
  {
    id: "ORD-9418",
    customerName: "Emma Watson",
    customerEmail: "emma@electrostock.com",
    products: [
      {
        productId: "prod-4",
        productName: "iPad Air M2",
        quantity: 1,
        priceAtOrder: 599,
      },
    ],
    totalAmount: 599,
    status: "Cancelled",
    date: "2026-05-30",
    trackingNumber: "TRK-INVALID-0",
  },
  {
    id: "ORD-9417",
    customerName: "Ryan Reynolds",
    customerEmail: "ryan.rey@electrostock.com",
    products: [
      {
        productId: "prod-1",
        productName: "Logitech MX Master 3S",
        quantity: 3,
        priceAtOrder: 99,
      },
    ],
    totalAmount: 297,
    status: "Completed",
    date: "2026-05-29",
    trackingNumber: "TRK-29481230",
  },
  {
    id: "ORD-9416",
    customerName: "Sophia Loren",
    customerEmail: "sophia@electrostock.com",
    products: [
      {
        productId: "prod-7",
        productName: "Samsung T7 Shield 2TB SSD",
        quantity: 5,
        priceAtOrder: 169,
      },
    ],
    totalAmount: 845,
    status: "Pending",
    date: "2026-05-28",
    trackingNumber: "TRK-10928373",
  },
];

export const REVENUE_LAST_7_DAYS = [
  { day: "Mon", revenue: 12500, orders: 120 },
  { day: "Tue", revenue: 16800, orders: 155 },
  { day: "Wed", revenue: 14200, orders: 130 },
  { day: "Thu", revenue: 21500, orders: 195 },
  { day: "Fri", revenue: 18900, orders: 170 },
  { day: "Sat", revenue: 22100, orders: 215 },
  { day: "Sun", revenue: 22430, orders: 255 },
];
export const REVENUE_LAST_30_DAYS = [
  { day: "Week 1", revenue: 28400, orders: 260 },
  { day: "Week 2", revenue: 32200, orders: 310 },
  { day: "Week 3", revenue: 31800, orders: 290 },
  { day: "Week 4", revenue: 36030, orders: 380 },
];
export const mockProducts = [
  // Trang 1
  {
    _id: "1",
    name: "Logitech MX Master 3S",
    description: "Chuột không dây công thái học",
    price: 99,
    stock: 45,
    image_url:
      "https://images.unsplash.com/photo-1527814050087-37938154791f?w=100&q=80",
  },
  {
    _id: "2",
    name: 'MacBook Pro 16" M3',
    description: "Laptop Apple M3 Max 36GB RAM",
    price: 2499,
    stock: 4,
    image_url:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&q=80",
  },
  {
    _id: "3",
    name: 'Dell UltraSharp 27"',
    description: "Màn hình đồ họa 4K",
    price: 599,
    stock: 0,
    image_url:
      "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=100&q=80",
  },
  {
    _id: "4",
    name: "Bàn phím Keychron K8",
    description: "Bàn phím cơ không dây",
    price: 89,
    stock: 12,
    image_url: "",
  },
  {
    _id: "5",
    name: "Tai nghe Sony WH-1000XM5",
    description: "Tai nghe chống ồn chủ động",
    price: 348,
    stock: 8,
    image_url: "",
  },

  // Trang 2
  {
    _id: "6",
    name: "Đế tản nhiệt Laptop",
    description: "Quạt tản nhiệt nhôm nguyên khối",
    price: 25,
    stock: 50,
    image_url: "",
  },
  {
    _id: "7",
    name: "Cáp sạc Anker Type-C",
    description: "Dài 1.8m, bọc dù chống đứt",
    price: 15,
    stock: 0,
    image_url: "",
  },
  {
    _id: "8",
    name: "Chuột Razer DeathAdder V3",
    description: "Chuột gaming siêu nhẹ 59g",
    price: 69,
    stock: 15,
    image_url: "",
  },
  {
    _id: "9",
    name: 'Màn hình LG 24" IPS',
    description: "Màn hình văn phòng viền mỏng",
    price: 150,
    stock: 3,
    image_url: "",
  },
  {
    _id: "10",
    name: "Bàn di chuột Corsair MM300",
    description: "Pad chuột size Extended",
    price: 30,
    stock: 120,
    image_url: "",
  },

  // Trang 3
  {
    _id: "11",
    name: "SSD Samsung 980 PRO 1TB",
    description: "Ổ cứng PCIe NVMe Gen 4",
    price: 99,
    stock: 0,
    image_url: "",
  },
  {
    _id: "12",
    name: "RAM Corsair Vengeance 32GB",
    description: "DDR5 6000MHz (2x16GB)",
    price: 85,
    stock: 20,
    image_url: "",
  },
  {
    _id: "13",
    name: "Loa Bluetooth JBL Flip 6",
    description: "Loa di động chống nước IP67",
    price: 129,
    stock: 5,
    image_url: "",
  },
  {
    _id: "14",
    name: "Hub USB-C UGREEN 7 in 1",
    description: "Cổng chuyển đổi Type-C ra HDMI, USB",
    price: 45,
    stock: 34,
    image_url: "",
  },
  {
    _id: "15",
    name: "Bàn phím cơ Leopold FC900R",
    description: "Bàn phím Fullsize Cherry MX Red",
    price: 130,
    stock: 2,
    image_url: "",
  },

  // Trang 4
  {
    _id: "16",
    name: "Tai nghe AirPods Pro 2",
    description: "Tai nghe True Wireless Apple",
    price: 249,
    stock: 11,
    image_url: "",
  },
  {
    _id: "17",
    name: "Apple Magic Trackpad",
    description: "Bàn di chuột cảm ứng đa điểm",
    price: 129,
    stock: 0,
    image_url: "",
  },
  {
    _id: "18",
    name: "Webcam Logitech C920x",
    description: "Webcam Full HD 1080p",
    price: 60,
    stock: 18,
    image_url: "",
  },
  {
    _id: "19",
    name: "Giá đỡ Laptop Moft",
    description: "Giá đỡ dán đáy tàng hình",
    price: 25,
    stock: 60,
    image_url: "",
  },
  {
    _id: "20",
    name: "Micro HyperX QuadCast",
    description: "Micro thu âm podcast/streaming",
    price: 140,
    stock: 7,
    image_url: "",
  },
];
