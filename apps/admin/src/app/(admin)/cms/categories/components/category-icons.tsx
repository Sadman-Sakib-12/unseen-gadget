export const BUILTIN_ICONS: { id: string; label: string }[] = [
  { id: "custom-image", label: "🖼️ Custom Uploaded Image / Logo" },
  { id: "iphones", label: "📱 iPhone / Smartphones" },
  { id: "macbook", label: "💻 MacBook / Laptops" },
  { id: "ipads", label: "📟 iPad / Tablets" },
  { id: "smart-watches", label: "⌚ Smart Watches" },
  { id: "apple-watch", label: "⌚ Apple Watch" },
  { id: "airpods", label: "🎧 AirPods / Earbuds" },
  { id: "headphones", label: "🎧 Headphones & Audio" },
  { id: "tws", label: "🎵 TWS Wireless" },
  { id: "power-bank", label: "🔋 Power Bank / Chargers" },
  { id: "cables", label: "🔌 Cables & Adapters" },
  { id: "iphone-cases", label: "🛡️ iPhone Cases & Covers" },
  { id: "ipad-cases", label: "🛡️ iPad Cases & Sleeves" },
  { id: "macbook-protection", label: "💼 MacBook Protection" },
  { id: "android-zone", label: "🤖 Android Zone" },
  { id: "gaming", label: "🎮 Gaming Zone" },
  { id: "cameras", label: "📷 Cameras & Lenses" },
  { id: "electronics", label: "⚡ Electronics" },
  { id: "home-appliances", label: "🏠 Home Appliances" },
  { id: "accessories", label: "📦 General Accessories" },
];

export function renderIconPreview(iconType: string, image?: string) {
  if (image) {
    return <img src={image} alt="Category Icon" className="h-full w-full object-contain p-1 rounded-full" />;
  }

  switch (iconType) {
    case "iphones":
    case "android-zone":
    case "smartphones":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <rect x="18" y="4" width="28" height="56" rx="5" />
          <line x1="28" y1="10" x2="36" y2="10" />
          <circle cx="32" cy="52" r="2" />
        </svg>
      );
    case "macbook":
    case "computers":
    case "laptops":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <rect x="8" y="10" width="48" height="32" rx="3" />
          <path d="M4 42h56l-4 8H8l-4-8z" />
        </svg>
      );
    case "ipads":
    case "ipads-tablets":
    case "tablets":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <rect x="10" y="6" width="44" height="52" rx="4" />
          <circle cx="32" cy="52" r="2" />
        </svg>
      );
    case "smart-watches":
    case "apple-watch":
    case "smartwatches":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <rect x="18" y="14" width="28" height="36" rx="10" />
          <circle cx="32" cy="32" r="8" />
        </svg>
      );
    case "airpods":
    case "tws":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <rect x="12" y="8" width="40" height="48" rx="10" />
          <ellipse cx="26" cy="28" rx="4" ry="6" />
          <ellipse cx="38" cy="28" rx="4" ry="6" />
        </svg>
      );
    case "headphones":
    case "audio":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <path d="M12 32 A20 20 0 0 1 52 32" />
          <rect x="8" y="32" width="8" height="16" rx="4" />
          <rect x="48" y="32" width="8" height="16" rx="4" />
        </svg>
      );
    case "power-bank":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <rect x="14" y="14" width="36" height="36" rx="6" />
          <polyline points="28,22 24,32 30,32 26,42" />
        </svg>
      );
    case "cables":
    case "accessories":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <circle cx="20" cy="44" r="8" />
          <path d="M26 38 L44 14" />
          <rect x="40" y="8" width="12" height="10" rx="2" />
        </svg>
      );
    case "gaming":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <rect x="10" y="20" width="44" height="28" rx="8" />
          <line x1="20" y1="34" x2="28" y2="34" />
          <line x1="24" y1="30" x2="24" y2="38" />
          <circle cx="42" cy="34" r="2.5" />
        </svg>
      );
    case "cameras":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <rect x="8" y="16" width="48" height="36" rx="6" />
          <path d="M22 16 L26 10 L38 10 L42 16 Z" />
          <circle cx="32" cy="34" r="10" />
        </svg>
      );
    case "home-appliances":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <path d="M12 20 L32 6 L52 20 L52 54 L12 54 Z" />
          <rect x="24" y="32" width="16" height="22" />
        </svg>
      );
    case "iphone-cases":
    case "ipad-cases":
    case "macbook-protection":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <path d="M32 4 L10 14 L10 32 C10 46 32 58 32 58 C32 58 54 46 54 32 L54 14 Z" />
          <path d="M24 30 L30 36 L42 24" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <circle cx="32" cy="32" r="22" />
          <circle cx="32" cy="32" r="8" />
        </svg>
      );
  }
}
