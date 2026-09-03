export type Language = "en" | "bn";
export type TranslationKey = string;

export const en: Record<string, string> = {
  // Navigation
  "nav.searchPlaceholder": "Search for products",
  "nav.categories": "Categories",
  "nav.support": "Support",
  "nav.myAccount": "My Account",
  "nav.wishlist": "Wishlist",
  "nav.cart": "Cart",
  "nav.item": "item",
  "nav.items": "items",
  "nav.viewAll": "View all",
  "nav.hotlines": "Hotlines",
  "nav.orderTracking": "Track Order",
  "nav.needHelp": "Need Help?",
  "nav.login": "Login",
  "nav.register": "Register",
  "nav.logout": "Logout",
  "nav.profile": "Profile",
  "nav.orders": "Orders",
  "nav.settings": "Settings",

  // Common
  "common.loading": "Loading…",
  "common.error": "Something went wrong",
  "common.retry": "Try Again",
  "common.goHome": "Go Home",
  "common.startShopping": "Start Shopping",
  "common.backToHome": "Back to Home",
  "common.viewAll": "View All",
  "common.viewDetails": "View Details",
  "common.apply": "Apply",
  "common.cancel": "Cancel",
  "common.save": "Save",
  "common.delete": "Delete",
  "common.remove": "Remove",
  "common.add": "Add",
  "common.search": "Search",
  "common.clearAll": "Clear All",
  "common.filters": "Filters",
  "common.sort": "Sort",
  "common.productsFound": "products found",
  "common.productFound": "product found",
  "common.items": "items",
  "common.item": "item",
  "common.noResults": "No results found",
  "common.tryAdjusting": "Try adjusting your search or filters",
  "common.inStock": "In Stock",
  "common.outOfStock": "Out of Stock",
  "common.addToCart": "Add to Cart",
  "common.buyNow": "Buy Now",
  "common.quantity": "Quantity",
  "common.color": "Color",
  "common.brand": "Brand",
  "common.price": "Price",
  "common.youSave": "You Save",
  "common.availability": "Availability",
  "common.seeMore": "See More",
  "common.readMore": "Read More",

  // Home Sections & Headings
  "home.heroTitle": "Premium Tech & Apple Gear",
  "home.heroSubtitle": "Genuine Apple accessories, MacBooks, iPhones, and top gadgets at the best prices in Bangladesh.",
  "home.shopNow": "Shop Now",
  "home.categoriesKicker": "Categories",
  "home.categoriesTitle": "Featured Categories",
  "home.section.iPads": "iPads",
  "home.section.phones": "Phones & Smartphones",
  "home.section.smartWatches": "Smart Watches",
  "home.section.audio": "Audio & Sound",
  "home.section.accessories": "Accessories",
  "home.section.newArrival": "New Arrivals",
  "home.section.topSelling": "Top Selling",
  "home.section.budgetTablets": "Budget Tablets & iPads",
  "home.section.handpicked": "Handpicked Products",
  "home.section.shopByBrand": "Shop By Brand",
  "home.section.shopByBrandSubtitle": "Explore official brands and top tech manufacturers",
  "home.section.shopByBrandCta": "All Brands",
  "home.section.trending": "Trending Now",
  "home.section.articles": "Latest Articles & Tech News",
  "home.whyKicker": "Why Choose Us",
  "home.whyTitle": "Your Trusted Tech Companion",

  // Benefits
  "home.benefits.delivery": "Fast Nationwide Delivery",
  "home.benefits.deliveryDesc": "Quick delivery across all 64 districts in Bangladesh",
  "home.benefits.genuine": "100% Genuine Products",
  "home.benefits.genuineDesc": "Official warranty and authentic gadgets guarantee",
  "home.benefits.warranty": "Official Warranty",
  "home.benefits.warrantyDesc": "Hassle-free replacement and support",
  "home.benefits.support": "24/7 Dedicated Support",
  "home.benefits.supportDesc": "Always here to help with your purchase",
  "home.benefits.payment": "Secure Payment Options",
  "home.benefits.paymentDesc": "bKash, Nagad, cards & cash on delivery",
  "home.benefits.emi": "36 Months EMI",
  "home.benefits.exchange": "Exchange Facility",
  "home.benefits.deals": "Best Price Deals",
  "home.benefits.service": "After-Sales Service",

  // Products
  "pdp.inStock": "In Stock",
  "pdp.outOfStock": "Out of Stock",
  "pdp.addToCart": "Add to Cart",
  "pdp.buyNow": "Buy Now",
  "pdp.warranty": "Warranty",
  "pdp.description": "Description",
  "pdp.specifications": "Specifications",
  "pdp.reviews": "Reviews",
  "pdp.related": "Related Products",
  "pdp.savings": "You Save",
  "pdp.freeDelivery": "Free Delivery",
  "pdp.deliveryInfo": "Delivery Info",
  "pdp.insideDhaka": "Inside Dhaka: 1-2 Days",
  "pdp.outsideDhaka": "Outside Dhaka: 2-4 Days",

  // Auth
  "auth.welcomeBack": "Welcome Back!",
  "auth.loginSubtitle": "Sign in to continue to your account",
  "auth.emailOrPhone": "Email or Phone",
  "auth.emailOrPhonePlaceholder": "Enter your email or phone",
  "auth.password": "Password",
  "auth.passwordPlaceholder": "Enter your password",
  "auth.rememberMe": "Remember me",
  "auth.forgotPassword": "Forgot password?",
  "auth.signIn": "Sign In",
  "auth.signingIn": "Signing in...",
  "auth.dontHaveAccount": "Don't have an account?",
  "auth.signUp": "Sign up",
  "auth.createAccount": "Create Account",
  "auth.registerSubtitle": "Join us today and get the best experience",
  "auth.fullName": "Full Name",
  "auth.fullNamePlaceholder": "Enter your full name",
  "auth.email": "Email",
  "auth.emailPlaceholder": "Enter your email",
  "auth.phone": "Phone Number",
  "auth.phonePlaceholder": "Enter your phone number",
  "auth.createPasswordPlaceholder": "Create a password",
  "auth.confirmPassword": "Confirm Password",
  "auth.confirmPasswordPlaceholder": "Confirm your password",
  "auth.agreeTerms": "I agree to the",
  "auth.termsAndConditions": "Terms & Conditions",
  "auth.and": "and",
  "auth.privacyPolicy": "Privacy Policy",
  "auth.creatingAccount": "Creating account...",
  "auth.orSignUpWith": "or sign up with",
  "auth.alreadyHaveAccount": "Already have an account?",

  // Cart & Checkout
  "cart.title": "Shopping Cart",
  "cart.empty": "Your cart is empty",
  "cart.emptyHint": "Looks like you haven't added anything yet.",
  "cart.continueShopping": "Continue Shopping",
  "cart.subtotal": "Subtotal",
  "cart.discount": "Discount",
  "cart.shipping": "Shipping",
  "cart.free": "Free",
  "cart.total": "Total",
  "cart.checkout": "Proceed to Checkout",
  "checkout.title": "Checkout",
  "checkout.placeOrder": "Place Order",

  // Account
  "account.title": "My Account",
  "account.dashboard": "Dashboard",
  "account.orders": "My Orders",
  "account.wishlist": "Wishlist",
  "account.addresses": "Addresses",
  "account.settings": "Settings",
  "account.logout": "Logout",
  "wishlist.title": "My Wishlist",
  "wishlist.empty": "Your wishlist is empty",
  "wishlist.browse": "Browse Products",

  // Footer
  "footer.categories": "Categories",
  "footer.help": "Help",
  "footer.useful": "Useful Links",
  "footer.subscribe": "Subscribe us",
  "footer.downloadApp": "Download App on Mobile:",
  "footer.freeDeliveryFirst": "Free Delivery on your first purchase",
  "footer.rights": "All rights reserved to Gadget BD",
  "footer.newsletterPlaceholder": "Your email address",
  "footer.newsletter": "Subscribe",
  "footer.paymentMethods": "We accept",

  // States
  "state.loading": "Loading…",
  "state.empty": "Nothing here yet",
  "state.error": "Something went wrong",
  "state.notFoundTitle": "Page Not Found",
  "state.backHome": "Back to Home",
};

export const bn = en;
export const CATEGORY_TRANSLATIONS: Record<string, string> = {};

export function translateCategory(name: string, _language?: Language): string {
  return name;
}

export function translate(_language: Language, key: TranslationKey): string {
  if (en[key]) return en[key];

  const parts = key.split(".");
  const last = parts[parts.length - 1] || key;
  return last
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export function formatTemplate(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    values[key] !== undefined ? String(values[key]) : `{${key}}`
  );
}
