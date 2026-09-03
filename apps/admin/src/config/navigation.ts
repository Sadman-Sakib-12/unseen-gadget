import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Package,
  Warehouse,
  Truck,
  ShoppingBag,
  Users,
  Ticket,
  Megaphone,
  TruckIcon,
  CreditCard,
  RotateCcw,
  Star,
  Receipt,
  BarChart3,
  FileText,
  Settings,
  Shield,
  Bell,
  Tags,
  type LucideIcon,
} from "lucide-react";

export interface SubNavItem {
  title: string;
  href: string;
  subItems?: { title: string; href: string }[];
}

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: { text: string; variant: "default" | "success" | "destructive" };
  subItems?: SubNavItem[];
  collapseOnly?: boolean;
  allowedRoles?: string[];
  requiredPermission?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, requiredPermission: "dashboard" },
  { title: "POS", href: "/pos", icon: ShoppingCart, allowedRoles: ["SUPER_ADMIN", "MANAGER", "STAFF", "CASHIER"], requiredPermission: "pos" },
  {
    title: "Orders",
    href: "/orders",
    icon: ClipboardList,
    allowedRoles: ["SUPER_ADMIN", "MANAGER", "STAFF", "CASHIER"],
    requiredPermission: "orders",
    collapseOnly: true,
    subItems: [
      { title: "All Orders", href: "/orders" },
      { title: "Pending", href: "/orders/pending" },
      { title: "Processing", href: "/orders/processing" },
      { title: "Shipped", href: "/orders/shipped" },
      { title: "Delivered", href: "/orders/delivered" },
      { title: "Cancelled", href: "/orders/cancelled" },
    ],
  },
  { title: "Products", href: "/products", icon: Package, allowedRoles: ["SUPER_ADMIN", "MANAGER", "STAFF"], requiredPermission: "products" },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Warehouse,
    allowedRoles: ["SUPER_ADMIN", "MANAGER", "STAFF"],
    requiredPermission: "inventory",
    collapseOnly: true,
    subItems: [
      { title: "Overview", href: "/inventory" },
      { title: "Stock Management", href: "/inventory/stock-management" },
      { title: "Stock In", href: "/inventory/stock-in" },
      { title: "Stock Out", href: "/inventory/stock-out" },
      { title: "Stock Adjustment", href: "/inventory/stock-adjustment" },
      { title: "Low Stock", href: "/inventory/low-stock" },
      { title: "Out of Stock", href: "/inventory/out-of-stock" },
      { title: "Stock History", href: "/inventory/stock-history" },
    ],
  },
  { title: "Suppliers", href: "/suppliers", icon: Truck, allowedRoles: ["SUPER_ADMIN", "MANAGER"], requiredPermission: "suppliers" },
  { title: "Purchases", href: "/purchases", icon: ShoppingBag, allowedRoles: ["SUPER_ADMIN", "MANAGER"], requiredPermission: "purchases" },
  { title: "Customers", href: "/customers", icon: Users, allowedRoles: ["SUPER_ADMIN", "MANAGER"], requiredPermission: "customers" },
  { title: "Categories", href: "/categories-brands", icon: Tags, allowedRoles: ["SUPER_ADMIN", "MANAGER"], requiredPermission: "categories" },
  { title: "Coupons", href: "/coupons", icon: Ticket, allowedRoles: ["SUPER_ADMIN", "MANAGER"], requiredPermission: "coupons" },
  { title: "Promotions", href: "/promotions", icon: Megaphone, allowedRoles: ["SUPER_ADMIN", "MANAGER"], requiredPermission: "promotions" },
  { title: "Delivery", href: "/delivery", icon: TruckIcon, allowedRoles: ["SUPER_ADMIN", "MANAGER"], requiredPermission: "delivery" },
  { title: "Payments", href: "/payments", icon: CreditCard, allowedRoles: ["SUPER_ADMIN", "MANAGER"], requiredPermission: "payments" },
  { title: "Returns & Refunds", href: "/returns", icon: RotateCcw, allowedRoles: ["SUPER_ADMIN", "MANAGER"], requiredPermission: "returns" },
  { title: "Reviews", href: "/reviews", icon: Star, allowedRoles: ["SUPER_ADMIN", "MANAGER"], requiredPermission: "reviews" },
  { title: "Expenses", href: "/expenses", icon: Receipt, allowedRoles: ["SUPER_ADMIN"], requiredPermission: "expenses" },
  { title: "Reports", href: "/reports", icon: BarChart3, allowedRoles: ["SUPER_ADMIN", "MANAGER"], requiredPermission: "reports" },
  { title: "Notifications", href: "/notifications", icon: Bell, allowedRoles: ["SUPER_ADMIN", "MANAGER", "STAFF"], requiredPermission: "notifications" },
  {
    title: "CMS",
    href: "/cms",
    icon: FileText,
    allowedRoles: ["SUPER_ADMIN", "MANAGER"],
    requiredPermission: "cms",
    collapseOnly: true,
    subItems: [
      {
        title: "Pages",
        href: "/cms/pages",
        subItems: [
          { title: "All Pages Overview", href: "/cms/pages" },
          { title: "Delivery & Return", href: "/cms/pages/delivery-return" },
          { title: "Our Contacts", href: "/cms/pages/contact" },
          { title: "Terms & Conditions", href: "/cms/pages/terms" },
          { title: "Privacy Policy", href: "/cms/pages/privacy" },
        ],
      },
      { title: "Featured Categories", href: "/cms/categories" },
      {
        title: "Blog & Layout",
        href: "/blog",
        subItems: [
          { title: "All Posts", href: "/blog" },
          { title: "Navbar CMS", href: "/blog/navbar" },
          { title: "Landing CMS", href: "/blog/landing" },
          { title: "Story Pages", href: "/blog/stories" },
          { title: "Banners", href: "/blog/banners" },
          { title: "Footer CMS", href: "/cms/footer" },
        ],
      },
      { title: "Brands", href: "/cms/brands" },
      { title: "Jobs / Careers", href: "/cms/jobs" },
    ],
  },
  { title: "Settings", href: "/settings", icon: Settings, allowedRoles: ["SUPER_ADMIN"], requiredPermission: "settings" },
  { title: "Admin Management", href: "/admin-management", icon: Shield, allowedRoles: ["SUPER_ADMIN"], requiredPermission: "admin_management" },
];
