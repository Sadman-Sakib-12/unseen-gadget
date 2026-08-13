import {
  ChevronRight,
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  ShoppingBag,
  Star,
  MapPin,
  Bell,
} from "lucide-react";
import Link from "next/link";

const cx = "mx-auto w-full max-w-[1320px] px-4";

const navItems = [
  { icon: User, label: "Dashboard", href: "/account", active: true },
  { icon: Package, label: "My Orders", href: "/account/orders", badge: "0" },
  { icon: Heart, label: "Wishlist", href: "/account/wishlist", badge: "0" },
  { icon: MapPin, label: "Addresses", href: "/account/addresses" },
  { icon: Bell, label: "Notifications", href: "/account/notifications" },
  { icon: Settings, label: "Settings", href: "/account/settings" },
];

const stats = [
  { icon: ShoppingBag, label: "Total Orders", value: "0", color: "bg-blue-50 text-blue-600" },
  { icon: Package, label: "Pending", value: "0", color: "bg-orange-50 text-orange-600" },
  { icon: Heart, label: "Wishlist", value: "0", color: "bg-pink-50 text-pink-600" },
  { icon: Star, label: "Reviews", value: "0", color: "bg-yellow-50 text-yellow-600" },
];

export default function AccountPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white">
        <div className={cx}>
          <nav className="flex items-center gap-1.5 py-3 text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900">My Account</span>
          </nav>
        </div>
      </div>

      <div className={`${cx} py-6`}>
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              {/* Profile header */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 px-5 py-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                  <User className="h-8 w-8 text-white" />
                </div>
                <p className="mt-3 text-sm font-bold text-white">Guest User</p>
                <p className="mt-0.5 text-xs text-blue-200">Not logged in</p>
                <Link
                  href="/login"
                  className="mt-3 inline-block rounded-lg bg-white px-4 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  Sign In
                </Link>
              </div>

              {/* Nav */}
              <nav className="p-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      item.active
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    {item.badge !== undefined && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}

                <button className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main */}
          <div className="space-y-5 lg:col-span-3">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="mt-0.5 text-[11px] text-gray-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Welcome card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">Welcome to Your Dashboard</h3>
              <p className="mt-1.5 text-sm text-gray-500">
                Manage your orders, saved items, and account details all in one place.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 transition hover:border-blue-500 hover:bg-blue-50/30"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <ShoppingBag className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Browse Products</p>
                    <p className="text-xs text-gray-500">Discover our latest collection</p>
                  </div>
                  <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
                </Link>

                <Link
                  href="/promotions"
                  className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 transition hover:border-orange-500 hover:bg-orange-50/30"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                    <Star className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Current Promotions</p>
                    <p className="text-xs text-gray-500">Check out the latest deals</p>
                  </div>
                  <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
                </Link>
              </div>
            </div>

            {/* Recent Orders (empty state) */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">Recent Orders</h3>
                <Link
                  href="/account/orders"
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-100 py-10 text-center">
                <Package className="h-10 w-10 text-gray-200" />
                <p className="mt-2 text-sm font-medium text-gray-500">No orders yet</p>
                <p className="mt-0.5 text-xs text-gray-400">
                  Your order history will appear here
                </p>
                <Link
                  href="/"
                  className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
