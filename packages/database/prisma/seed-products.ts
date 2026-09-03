import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding real products into PostgreSQL database...");

  // Lookup categories
  const catIpads = await prisma.category.findUnique({ where: { slug: "ipads-tablets" } });
  const catTabs = await prisma.category.findUnique({ where: { slug: "tablets" } });
  const catComputers = await prisma.category.findUnique({ where: { slug: "computers" } });
  const catWatches = await prisma.category.findUnique({ where: { slug: "smart-watches" } });
  const catAudio = await prisma.category.findUnique({ where: { slug: "audio" } });

  // Lookup brands
  const brandApple = await prisma.brand.findUnique({ where: { slug: "apple" } });
  const brandSamsung = await prisma.brand.findUnique({ where: { slug: "samsung" } });
  const brandSony = await prisma.brand.findUnique({ where: { slug: "sony" } });
  const brandDell = await prisma.brand.findUnique({ where: { slug: "dell" } });
  const brandSmartLife = await prisma.brand.findUnique({ where: { slug: "smartlife" } });

  const productsToSeed = [
    // iPad & Tablets
    {
      name: "Apple iPad Air M4",
      slug: "apple-ipad-air-m4",
      description: "iPad Air with the astonishingly fast Apple M4 chip. Incredible Liquid Retina display, landscape 12MP front camera, and ultrafast Wi-Fi 6E.",
      price: 78000,
      originalPrice: 85000,
      discount: 8,
      stock: 35,
      inStock: true,
      badge: "Popular",
      rating: 4.9,
      ratingCount: 18,
      colors: ["Space Gray", "Starlight", "Purple", "Blue"],
      images: [
        "/images/products/ipad-air-m4.jpg",
        "https://res.cloudinary.com/r3fekpys/image/upload/v1788115575/unseen-gadget/products/ureamnsuaza0yggqxt28.jpg"
      ],
      sku: "IPAD-AIR-M4-128",
      status: "ACTIVE" as const,
      shippingType: "FREE" as const,
      shippingCost: 0,
      featured: true,
      categoryId: catIpads?.id || catTabs?.id!,
      brandId: brandApple?.id,
      specifications: {
        Display: "11-inch Liquid Retina display",
        Chip: "Apple M4 chip with 8-core CPU and 10-core GPU",
        Camera: "12MP Wide back camera, landscape 12MP Ultra Wide front camera",
        Storage: "128GB / 256GB / 512GB / 1TB",
        Connectivity: "Wi-Fi 6E + 5G Cellular",
        Battery: "Up to 10 hours of surfing the web"
      }
    },
    {
      name: "Apple iPad Pro M5 13-inch",
      slug: "apple-ipad-pro-m5-13",
      description: "The ultimate iPad experience. Breakthrough Ultra Retina XDR display powered by tandem OLED technology and extreme performance with the next-gen Apple M5 chip.",
      price: 145000,
      originalPrice: 155000,
      discount: 6,
      stock: 20,
      inStock: true,
      badge: "Flagship",
      rating: 5.0,
      ratingCount: 24,
      colors: ["Space Black", "Silver"],
      images: [
        "/images/products/ipad-pro-m5-13.jpg",
        "https://res.cloudinary.com/r3fekpys/image/upload/v1788115575/unseen-gadget/products/ureamnsuaza0yggqxt28.jpg"
      ],
      sku: "IPAD-PRO-M5-13-256",
      status: "ACTIVE" as const,
      shippingType: "FREE" as const,
      shippingCost: 0,
      featured: true,
      categoryId: catIpads?.id || catTabs?.id!,
      brandId: brandApple?.id,
      specifications: {
        Display: "13-inch Ultra Retina XDR tandem OLED display",
        Chip: "Apple M5 chip with next-gen Neural Engine",
        Camera: "12MP Wide with LiDAR Scanner",
        Storage: "256GB / 512GB / 1TB / 2TB",
        Audio: "Four-speaker sound system with studio-quality mics"
      }
    },
    {
      name: "Apple iPad 11th Gen",
      slug: "apple-ipad-11th-gen",
      description: "Colorfully reimagined iPad for everyday versatility. All-screen design with 10.9-inch Liquid Retina display, fast A16 Bionic chip, and Apple Pencil support.",
      price: 48000,
      originalPrice: 52000,
      discount: 7,
      stock: 40,
      inStock: true,
      badge: "Best Seller",
      rating: 4.8,
      ratingCount: 32,
      colors: ["Silver", "Yellow", "Pink", "Blue"],
      images: [
        "/images/products/ipad-11th-gen.jpg"
      ],
      sku: "IPAD-11GEN-64",
      status: "ACTIVE" as const,
      shippingType: "FREE" as const,
      shippingCost: 0,
      featured: true,
      categoryId: catIpads?.id || catTabs?.id!,
      brandId: brandApple?.id,
      specifications: {
        Display: "10.9-inch Liquid Retina display",
        Chip: "A16 Bionic chip with 16-core Neural Engine",
        Camera: "12MP Wide back camera, landscape 12MP Ultra Wide front camera",
        Storage: "64GB / 256GB",
        Connector: "USB-C connector"
      }
    },
    {
      name: "Samsung Galaxy Tab S9 Ultra",
      slug: "samsung-galaxy-tab-s9-ultra",
      description: "The gold standard in premium Android tablets. Huge 14.6-inch Dynamic AMOLED 2X display, IP68 water and dust resistance, and bundled S Pen.",
      price: 115000,
      originalPrice: 125000,
      discount: 8,
      stock: 15,
      inStock: true,
      badge: "Premium",
      rating: 4.8,
      ratingCount: 14,
      colors: ["Graphite", "Beige"],
      images: [
        "/images/products/ipad-pro-m5-13.jpg"
      ],
      sku: "TAB-S9-ULTRA-256",
      status: "ACTIVE" as const,
      shippingType: "FREE" as const,
      shippingCost: 0,
      featured: false,
      categoryId: catIpads?.id || catTabs?.id!,
      brandId: brandSamsung?.id,
      specifications: {
        Display: "14.6-inch Dynamic AMOLED 2X, 120Hz, HDR10+",
        Processor: "Qualcomm Snapdragon 8 Gen 2",
        Memory: "12GB RAM, 256GB / 512GB Storage",
        Battery: "11,200 mAh with 45W fast charging"
      }
    },

    // Budget Tablets
    {
      name: "Xiaomi Pad 7",
      slug: "xiaomi-pad-7",
      description: "Crisp 11.2-inch 144Hz 3.2K display with flagship Snapdragon processor and Quad stereo speakers tuned for entertainment and productivity.",
      price: 38000,
      originalPrice: 42000,
      discount: 10,
      stock: 25,
      inStock: true,
      badge: "Hot Deal",
      rating: 4.7,
      ratingCount: 22,
      colors: ["Black", "Blue", "Green"],
      images: [
        "/images/products/xiaomi-pad-7.jpg"
      ],
      sku: "XIAOMI-PAD-7-128",
      status: "ACTIVE" as const,
      shippingType: "FREE" as const,
      shippingCost: 0,
      featured: true,
      categoryId: catTabs?.id || catIpads?.id!,
      brandId: brandSmartLife?.id,
      specifications: {
        Display: "11.2-inch 3.2K 144Hz Crystal Display",
        Chip: "Snapdragon 8s Gen 3 Mobile Platform",
        Battery: "8850 mAh with 67W Turbo Charge"
      }
    },
    {
      name: "Redmi Pad 2 Pro",
      slug: "redmi-pad-2-pro",
      description: "Huge 12.1-inch 2.5K 120Hz display with massive 10,000mAh battery for all-day entertainment and schoolwork.",
      price: 28000,
      originalPrice: 32000,
      discount: 12,
      stock: 30,
      inStock: true,
      badge: "Budget King",
      rating: 4.6,
      ratingCount: 45,
      colors: ["Dark Gray", "Mint Green"],
      images: [
        "/images/products/redmi-pad-2-pro.jpg"
      ],
      sku: "REDMI-PAD2-PRO-128",
      status: "ACTIVE" as const,
      shippingType: "FREE" as const,
      shippingCost: 0,
      featured: false,
      categoryId: catTabs?.id || catIpads?.id!,
      brandId: brandSmartLife?.id,
      specifications: {
        Display: "12.1-inch 120Hz 2.5K LCD Display",
        Battery: "10,000 mAh battery with 33W fast charging",
        Speakers: "Quad speakers with Dolby Atmos"
      }
    },

    // Laptops & Computers
    {
      name: "Apple MacBook Air M5",
      slug: "apple-macbook-air-m5",
      description: "Strikingly thin and fast. The new MacBook Air with Apple M5 chip brings unbelievable battery life, vibrant Liquid Retina display, and silent fanless design.",
      price: 165000,
      originalPrice: 175000,
      discount: 5,
      stock: 18,
      inStock: true,
      badge: "New Arrival",
      rating: 4.9,
      ratingCount: 29,
      colors: ["Midnight", "Starlight", "Space Gray", "Silver"],
      images: [
        "/images/products/macbook-air-m5.jpg",
        "https://res.cloudinary.com/r3fekpys/image/upload/v1788115503/unseen-gadget/products/ku8b4bkemfu4hscl3ek8.png"
      ],
      sku: "MBA-M5-16-512",
      status: "ACTIVE" as const,
      shippingType: "FREE" as const,
      shippingCost: 0,
      featured: true,
      categoryId: catComputers?.id!,
      brandId: brandApple?.id,
      specifications: {
        Display: "15.3-inch Liquid Retina display with True Tone",
        Processor: "Apple M5 chip with 10-core CPU and 10-core GPU",
        Memory: "16GB Unified Memory",
        Storage: "512GB SSD Storage",
        Battery: "Up to 18 hours battery life"
      }
    },
    {
      name: "Dell XPS 15 OLED",
      slug: "dell-xps-15-oled",
      description: "High-performance creator laptop with stunning 3.5K OLED InfinityEdge touch display, Intel Core Ultra processor, and premium CNC machined aluminum.",
      price: 210000,
      originalPrice: 230000,
      discount: 8,
      stock: 10,
      inStock: true,
      badge: "Creator Edition",
      rating: 4.8,
      ratingCount: 11,
      colors: ["Platinum Silver"],
      images: [
        "/images/products/macbook-air-m5.jpg"
      ],
      sku: "DELL-XPS15-OLED-32",
      status: "ACTIVE" as const,
      shippingType: "FREE" as const,
      shippingCost: 0,
      featured: false,
      categoryId: catComputers?.id!,
      brandId: brandDell?.id,
      specifications: {
        Display: "15.6-inch 3.5K (3456x2160) OLED Touch Display",
        Processor: "Intel Core Ultra 7 155H",
        Memory: "32GB DDR5 RAM",
        Storage: "1TB PCIe NVMe SSD",
        Graphics: "NVIDIA GeForce RTX 4060 8GB GDDR6"
      }
    },

    // Smart Watches
    {
      name: "Apple Watch Series 10",
      slug: "apple-watch-series-10",
      description: "Thinnest Apple Watch ever with the biggest display. Wide-angle OLED display, breakthrough health sensors with sleep apnea notifications, and faster charging.",
      price: 58000,
      originalPrice: 62000,
      discount: 6,
      stock: 25,
      inStock: true,
      badge: "Best Seller",
      rating: 4.9,
      ratingCount: 38,
      colors: ["Jet Black", "Rose Gold", "Silver"],
      images: [
        "https://res.cloudinary.com/r3fekpys/image/upload/v1788111757/unseen-gadget/products/gaxkglo4loczewi0q1vw.png"
      ],
      sku: "AW-S10-46MM",
      status: "ACTIVE" as const,
      shippingType: "FREE" as const,
      shippingCost: 0,
      featured: true,
      categoryId: catWatches?.id!,
      brandId: brandApple?.id,
      specifications: {
        Case: "46mm polished aluminum or aerospace-grade titanium",
        Display: "Wide-angle OLED Always-On Retina display (up to 2000 nits)",
        Sensors: "ECG, Blood Oxygen, Temperature sensing, Depth gauge to 6m",
        Battery: "All-day 18-hour battery life with 80% charge in 30 minutes"
      }
    },
    {
      name: "Apple Watch Ultra 2",
      slug: "apple-watch-ultra-2",
      description: "The most rugged and capable Apple Watch. Engineered for outdoor adventure and endurance sports with lightweight titanium case and dual-frequency GPS.",
      price: 95000,
      originalPrice: 105000,
      discount: 9,
      stock: 12,
      inStock: true,
      badge: "Adventure",
      rating: 5.0,
      ratingCount: 19,
      colors: ["Natural Titanium", "Black Titanium"],
      images: [
        "https://res.cloudinary.com/r3fekpys/image/upload/v1788111757/unseen-gadget/products/gaxkglo4loczewi0q1vw.png"
      ],
      sku: "AW-ULTRA2-49MM",
      status: "ACTIVE" as const,
      shippingType: "FREE" as const,
      shippingCost: 0,
      featured: true,
      categoryId: catWatches?.id!,
      brandId: brandApple?.id,
      specifications: {
        Case: "49mm aerospace-grade titanium case",
        Display: "Always-On Retina display up to 3000 nits",
        WaterResistance: "100m water resistant with EN13319 dive certification",
        Battery: "Up to 36 hours normal use, 72 hours low power mode"
      }
    },

    // Headphones & Audio
    {
      name: "Apple AirPods Pro 2 (USB-C)",
      slug: "apple-airpods-pro-2-usb-c",
      description: "Up to 2x more Active Noise Cancellation, Adaptive Audio, Transparency mode, and Personalized Spatial Audio with dynamic head tracking.",
      price: 28500,
      originalPrice: 32000,
      discount: 10,
      stock: 45,
      inStock: true,
      badge: "Must Have",
      rating: 4.9,
      ratingCount: 65,
      colors: ["White"],
      images: [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"
      ],
      sku: "AIRPODS-PRO2-USBC",
      status: "ACTIVE" as const,
      shippingType: "FREE" as const,
      shippingCost: 0,
      featured: true,
      categoryId: catAudio?.id!,
      brandId: brandApple?.id,
      specifications: {
        Chip: "Apple H2 headphone chip in earbuds, U1 in MagSafe charging case",
        Audio: "Custom high-excursion Apple driver, custom high dynamic range amplifier",
        Battery: "Up to 6 hours listening on single charge, 30 hours with case",
        Resistance: "Dust, sweat, and water resistant (IP54)"
      }
    },
    {
      name: "Sony WH-1000XM5 Wireless Headphones",
      slug: "sony-wh-1000xm5-wireless-headphones",
      description: "Industry-leading noise cancellation with two processors and eight microphones. Magnificent Sound quality with newly developed 30mm driver.",
      price: 38000,
      originalPrice: 42000,
      discount: 9,
      stock: 20,
      inStock: true,
      badge: "Audiophile",
      rating: 4.9,
      ratingCount: 42,
      colors: ["Black", "Silver", "Midnight Blue"],
      images: [
        "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80"
      ],
      sku: "SONY-WH1000XM5-BK",
      status: "ACTIVE" as const,
      shippingType: "FREE" as const,
      shippingCost: 0,
      featured: true,
      categoryId: catAudio?.id!,
      brandId: brandSony?.id,
      specifications: {
        Driver: "30mm precision-engineered carbon fiber driver unit",
        NoiseCanceling: "Integrated Processor V1 and HD Noise Canceling Processor QN1",
        Battery: "Up to 30 hours battery life with quick charging (3 min = 3 hours)"
      }
    }
  ];

  for (const p of productsToSeed) {
    if (!p.categoryId) {
      console.warn(`Skipping ${p.name}, categoryId missing`);
      continue;
    }

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        stock: p.stock,
        inStock: p.inStock,
        badge: p.badge,
        rating: p.rating,
        ratingCount: p.ratingCount,
        colors: p.colors,
        images: p.images,
        sku: p.sku,
        status: p.status,
        shippingType: p.shippingType,
        shippingCost: p.shippingCost,
        featured: p.featured,
        categoryId: p.categoryId,
        brandId: p.brandId,
        specifications: p.specifications,
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        stock: p.stock,
        inStock: p.inStock,
        badge: p.badge,
        rating: p.rating,
        ratingCount: p.ratingCount,
        colors: p.colors,
        images: p.images,
        sku: p.sku,
        status: p.status,
        shippingType: p.shippingType,
        shippingCost: p.shippingCost,
        featured: p.featured,
        categoryId: p.categoryId,
        brandId: p.brandId,
        specifications: p.specifications,
      }
    });
    console.log(`Upserted: ${p.name}`);
  }

  console.log("Successfully seeded all products into PostgreSQL database!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
