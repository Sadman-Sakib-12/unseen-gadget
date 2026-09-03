interface CategoryIconProps {
  name?: string;
  image?: string;
  className?: string;
}

export function CategoryIcon({ name, image, className = "h-full w-full" }: CategoryIconProps) {
  if (image) {
    return (
      <img
        src={image}
        alt={name || "Category"}
        className="h-full w-full object-contain p-1 rounded-full"
        loading="lazy"
      />
    );
  }

  const key = (name || "").toLowerCase();

  switch (key) {
    case "iphones":
    case "android-zone":
    case "smartphones":
    case "phones":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="18" y="4" width="28" height="56" rx="5" />
          <line x1="28" y1="10" x2="36" y2="10" />
          <circle cx="32" cy="52" r="2" />
          <rect x="22" y="16" width="20" height="28" rx="1" />
        </svg>
      );
    case "macbook":
    case "computers":
    case "laptops":
    case "computer-laptops":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="8" y="10" width="48" height="32" rx="3" />
          <rect x="16" y="16" width="32" height="20" rx="1" />
          <path d="M4 42h56l-4 8H8l-4-8z" />
          <line x1="24" y1="46" x2="40" y2="46" />
        </svg>
      );
    case "ipads":
    case "ipads-tablets":
    case "tablets":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="10" y="6" width="44" height="52" rx="4" />
          <circle cx="32" cy="52" r="2" />
          <rect x="15" y="12" width="34" height="32" rx="1" />
        </svg>
      );
    case "smart-watches":
    case "apple-watch":
    case "smartwatches":
    case "wearables":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="18" y="14" width="28" height="36" rx="10" />
          <line x1="24" y1="6" x2="24" y2="14" />
          <line x1="40" y1="6" x2="40" y2="14" />
          <line x1="24" y1="50" x2="24" y2="58" />
          <line x1="40" y1="50" x2="40" y2="58" />
          <circle cx="32" cy="32" r="8" />
          <line x1="32" y1="26" x2="32" y2="32" />
          <line x1="32" y1="32" x2="37" y2="35" />
        </svg>
      );
    case "airpods":
    case "tws":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="12" y="8" width="40" height="48" rx="10" />
          <ellipse cx="26" cy="28" rx="4" ry="6" />
          <ellipse cx="38" cy="28" rx="4" ry="6" />
          <line x1="26" y1="34" x2="26" y2="44" />
          <line x1="38" y1="34" x2="38" y2="44" />
        </svg>
      );
    case "headphones":
    case "audio":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 32 A20 20 0 0 1 52 32" />
          <rect x="8" y="32" width="10" height="18" rx="4" />
          <rect x="46" y="32" width="10" height="18" rx="4" />
        </svg>
      );
    case "power-bank":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="12" y="16" width="40" height="32" rx="6" />
          <rect x="28" y="10" width="8" height="6" rx="1" />
          <polyline points="26,24 22,32 28,32 24,40" />
          <circle cx="44" cy="32" r="4" />
        </svg>
      );
    case "cables":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="16" cy="44" r="8" />
          <circle cx="16" cy="44" r="3" />
          <path d="M22 38 L40 14" />
          <rect x="36" y="8" width="12" height="10" rx="2" />
          <line x1="40" y1="18" x2="40" y2="28" />
          <line x1="44" y1="18" x2="44" y2="28" />
        </svg>
      );
    case "iphone-cases":
    case "cases-protectors":
    case "ipad-cases":
    case "macbook-protection":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="16" y="4" width="32" height="56" rx="6" />
          <rect x="20" y="8" width="24" height="48" rx="4" />
          <line x1="26" y1="12" x2="38" y2="12" />
          <circle cx="32" cy="54" r="1.5" />
        </svg>
      );
    case "gaming":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="10" y="20" width="44" height="28" rx="8" />
          <line x1="20" y1="34" x2="28" y2="34" />
          <line x1="24" y1="30" x2="24" y2="38" />
          <circle cx="42" cy="34" r="2.5" />
        </svg>
      );
    case "cameras":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="8" y="18" width="48" height="34" rx="6" />
          <path d="M22 18 L26 12 L38 12 L42 18 Z" />
          <circle cx="32" cy="35" r="10" />
        </svg>
      );
    case "electronics":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="10" y="14" width="44" height="36" rx="4" />
          <line x1="10" y1="38" x2="54" y2="38" />
          <circle cx="32" cy="45" r="2" />
        </svg>
      );
    case "home-appliances":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="16" y="10" width="32" height="46" rx="4" />
          <line x1="16" y1="26" x2="48" y2="26" />
          <line x1="22" y1="18" x2="26" y2="18" />
        </svg>
      );
    case "storage":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="12" y="12" width="40" height="40" rx="4" />
          <line x1="12" y1="36" x2="52" y2="36" />
          <circle cx="44" cy="44" r="2" />
        </svg>
      );
    case "accessories":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="20" cy="44" r="8" />
          <path d="M26 38 L44 14" />
          <rect x="40" y="8" width="12" height="10" rx="2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="32" cy="32" r="20" />
          <line x1="24" y1="32" x2="40" y2="32" />
          <line x1="32" y1="24" x2="32" y2="40" />
        </svg>
      );
  }
}
