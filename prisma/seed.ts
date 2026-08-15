import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "./generated/client";

// ساخت آداپتور برای پریسما
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// پاس دادن آداپتور به کلاینت
const prisma = new PrismaClient({ adapter });

async function seedUsers() {
  const adminPasswordHash = await bcrypt.hash("Admin@12345", 10);
  const customerPasswordHash = await bcrypt.hash("Admin@12345", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: { 
      name: "مدیر فروشگاه",
      email: "admin@example.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "مشتری نمونه",
      email: "customer@example.com",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
    },
  });

  console.log("✓ Users seeded:", {
    admin: admin.email,
    customer: customer.email,
  });
  return { admin, customer };
}

async function seedCategories() {
  const electronics = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: { name: "لوازم الکترونیکی", slug: "electronics" },
  });

  const mobilePhones = await prisma.category.upsert({
    where: { slug: "mobile-phones" },
    update: {},
    create: {
      name: "گوشی موبایل",
      slug: "mobile-phones",
      parentId: electronics.id,
    },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: "clothing" },
    update: {},
    create: { name: "پوشاک", slug: "clothing" },
  });

  const mensClothing = await prisma.category.upsert({
    where: { slug: "mens-clothing" },
    update: {},
    create: {
      name: "پوشاک مردانه",
      slug: "mens-clothing",
      parentId: clothing.id,
    },
  });

  console.log("✓ Categories seeded");
  return { electronics, mobilePhones, clothing, mensClothing };
}

async function seedBrands() {
  const brandA = await prisma.brand.upsert({
    where: { slug: "brand-a" },
    update: {},
    create: { name: "برند نمونه A", slug: "brand-a" },
  });

  const brandB = await prisma.brand.upsert({
    where: { slug: "brand-b" },
    update: {},
    create: { name: "برند نمونه B", slug: "brand-b" },
  });

  console.log("✓ Brands seeded");
  return { brandA, brandB };
}

async function seedAttributes() {
  // Attribute + AttributeValue با upsert روی @@unique([attributeId, slug]) کمی پیچیده‌تره،
  // چون attributeId از قبل معلوم نیست؛ پس اول Attribute رو upsert می‌کنیم، بعد Valueها رو.
  const colorAttribute = await prisma.attribute.upsert({
    where: { slug: "color" },
    update: {},
    create: { name: "رنگ", slug: "color" },
  });

  const sizeAttribute = await prisma.attribute.upsert({
    where: { slug: "size" },
    update: {},
    create: { name: "سایز", slug: "size" },
  });

  const colorValues = await Promise.all(
    [
      { value: "قرمز", slug: "red" },
      { value: "آبی", slug: "blue" },
      { value: "مشکی", slug: "black" },
    ].map((v) =>
      prisma.attributeValue.upsert({
        where: {
          attributeId_slug: { attributeId: colorAttribute.id, slug: v.slug },
        },
        update: {},
        create: {
          attributeId: colorAttribute.id,
          value: v.value,
          slug: v.slug,
        },
      }),
    ),
  );

  const sizeValues = await Promise.all(
    [
      { value: "کوچک", slug: "s" },
      { value: "متوسط", slug: "m" },
      { value: "بزرگ", slug: "l" },
    ].map((v) =>
      prisma.attributeValue.upsert({
        where: {
          attributeId_slug: { attributeId: sizeAttribute.id, slug: v.slug },
        },
        update: {},
        create: { attributeId: sizeAttribute.id, value: v.value, slug: v.slug },
      }),
    ),
  );

  console.log("✓ Attributes seeded");
  return { colorAttribute, sizeAttribute, colorValues, sizeValues };
}

async function seedTags() {
  const newTag = await prisma.tag.upsert({
    where: { slug: "new" },
    update: {},
    create: { name: "جدید", slug: "new" },
  });

  const bestsellerTag = await prisma.tag.upsert({
    where: { slug: "bestseller" },
    update: {},
    create: { name: "پرفروش", slug: "bestseller" },
  });

  console.log("✓ Tags seeded");
  return { newTag, bestsellerTag };
}

async function seedProducts(params: {
  categories: Awaited<ReturnType<typeof seedCategories>>;
  brands: Awaited<ReturnType<typeof seedBrands>>;
  attributes: Awaited<ReturnType<typeof seedAttributes>>;
  tags: Awaited<ReturnType<typeof seedTags>>;
}) {
  const { categories, brands, attributes, tags } = params;

  // ---------- محصول ۱: گوشی موبایل با چند Variant واقعی (رنگ) ----------
  let phone = await prisma.product.findUnique({
    where: { slug: "sample-smartphone" },
  });
  if (!phone) {
    phone = await prisma.product.create({
      data: {
        name: "گوشی هوشمند نمونه",
        slug: "sample-smartphone",
        description: "یک گوشی هوشمند نمونه برای تست فروشگاه، با چند رنگ مختلف.",
        categoryId: categories.mobilePhones.id,
        brandId: brands.brandA.id,
        isPublished: true,
      },
    });

    const [redVariant, blueVariant, blackVariant] = await Promise.all([
      prisma.variant.create({
        data: {
          productId: phone.id,
          sku: "PHONE-RED-128",
          price: 15000000,
          compareAtPrice: 16500000,
          stock: 25,
          lowStockThreshold: 5,
          isDefault: true,
        },
      }),
      prisma.variant.create({
        data: {
          productId: phone.id,
          sku: "PHONE-BLUE-128",
          price: 15000000,
          stock: 18,
          lowStockThreshold: 5,
        },
      }),
      prisma.variant.create({
        data: {
          productId: phone.id,
          sku: "PHONE-BLACK-128",
          price: 15200000,
          stock: 3, // عمداً کم — برای تست هشدار Low Stock
          lowStockThreshold: 5,
        },
      }),
    ]);

    await prisma.variantAttributeValue.createMany({
      data: [
        {
          variantId: redVariant.id,
          attributeValueId: attributes.colorValues[0].id,
        },
        {
          variantId: blueVariant.id,
          attributeValueId: attributes.colorValues[1].id,
        },
        {
          variantId: blackVariant.id,
          attributeValueId: attributes.colorValues[2].id,
        },
      ],
    });

    await prisma.productImage.createMany({
      data: [
        {
          productId: phone.id,
          url: "https://placehold.co/600x600.png?text=Phone+Main", 
        },
        {
          productId: phone.id,
          variantId: redVariant.id,
          url: "https://placehold.co/600x600.png?text=Phone+Red", 
          sortOrder: 1,
        },
        {
          productId: phone.id,
          variantId: blueVariant.id,
          url: "https://placehold.co/600x600.png?text=Phone+Blue",
          sortOrder: 2,
        },
      ],
    });

    await prisma.productTag.createMany({
      data: [
        { productId: phone.id, tagId: tags.newTag.id },
        { productId: phone.id, tagId: tags.bestsellerTag.id },
      ],
    });
  }

  // ---------- محصول ۲: تی‌شرت با رنگ + سایز (ترکیب دو Attribute) ----------
  let tshirt = await prisma.product.findUnique({
    where: { slug: "sample-tshirt" },
  });
  if (!tshirt) {
    tshirt = await prisma.product.create({
      data: {
        name: "تی‌شرت نمونه",
        slug: "sample-tshirt",
        description: "یک تی‌شرت نخی نمونه با چند رنگ و سایز مختلف.",
        categoryId: categories.mensClothing.id,
        brandId: brands.brandB.id,
        isPublished: true,
      },
    });

    const blackM = await prisma.variant.create({
      data: {
        productId: tshirt.id,
        sku: "TSHIRT-BLACK-M",
        price: 450000,
        stock: 40,
        isDefault: true,
      },
    });
    const blackL = await prisma.variant.create({
      data: {
        productId: tshirt.id,
        sku: "TSHIRT-BLACK-L",
        price: 450000,
        stock: 30,
      },
    });
    const redM = await prisma.variant.create({
      data: {
        productId: tshirt.id,
        sku: "TSHIRT-RED-M",
        price: 470000,
        stock: 20,
      },
    });

    await prisma.variantAttributeValue.createMany({
      data: [
        {
          variantId: blackM.id,
          attributeValueId: attributes.colorValues[2].id,
        }, // مشکی
        { variantId: blackM.id, attributeValueId: attributes.sizeValues[1].id }, // متوسط
        {
          variantId: blackL.id,
          attributeValueId: attributes.colorValues[2].id,
        },
        { variantId: blackL.id, attributeValueId: attributes.sizeValues[2].id }, // بزرگ
        { variantId: redM.id, attributeValueId: attributes.colorValues[0].id }, // قرمز
        { variantId: redM.id, attributeValueId: attributes.sizeValues[1].id },
      ],
    });

    await prisma.productImage.create({
      data: {
        productId: tshirt.id,
        url: "https://placehold.co/600x600?text=T-Shirt",
        sortOrder: 0,
      },
    });
  }

  // ---------- محصول ۳: یک محصول ساده با فقط Default Variant (بدون رنگ/سایز) ----------
  let simpleProduct = await prisma.product.findUnique({
    where: { slug: "sample-simple-gadget" },
  });
  if (!simpleProduct) {
    simpleProduct = await prisma.product.create({
      data: {
        name: "گجت ساده‌ی نمونه",
        slug: "sample-simple-gadget",
        description:
          "یک محصول ساده بدون Variant اضافه — فقط یک نسخه برای فروش.",
        categoryId: categories.electronics.id,
        isPublished: true,
      },
    });

    await prisma.variant.create({
      data: {
        productId: simpleProduct.id,
        sku: "GADGET-DEFAULT",
        price: 890000,
        stock: 60,
        isDefault: true,
      },
    });
  }

  console.log("✓ Products + Variants seeded:", {
    phone: phone.slug,
    tshirt: tshirt.slug,
    simpleProduct: simpleProduct.slug,
  });
}

async function seedCoupons() {
  const percentageCoupon = await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: 10,
      minOrderAmount: 500000,
      maxUsageCount: 100,
      expiresAt: new Date(new Date().getFullYear() + 1, 0, 1),
    },
  });

  const fixedCoupon = await prisma.coupon.upsert({
    where: { code: "SAVE50K" },
    update: {},
    create: {
      code: "SAVE50K",
      type: "FIXED_AMOUNT",
      value: 50000,
      minOrderAmount: 300000,
    },
  });

  console.log("✓ Coupons seeded:", {
    percentageCoupon: percentageCoupon.code,
    fixedCoupon: fixedCoupon.code,
  });
}

async function seedContent() {
  await prisma.page.upsert({
    where: { slug: "about-us" },
    update: {},
    create: {
      slug: "about-us",
      title: "درباره‌ی ما",
      htmlContent: "<p>این یک متن نمونه درباره‌ی فروشگاه است.</p>",
      isPublished: true,
    },
  });

  await prisma.page.upsert({
    where: { slug: "faq" },
    update: {},
    create: {
      slug: "faq",
      title: "سوالات متداول",
      htmlContent:
        "<p>پاسخ به سوالات پرتکرار مشتریان در این‌جا قرار می‌گیرد.</p>",
      isPublished: true,
    },
  });

  const bannerCount = await prisma.banner.count();
  if (bannerCount === 0) {
    await prisma.banner.createMany({
      data: [
        {
          title: "بنر اصلی صفحه‌ی اول",
          imageUrl: "https://placehold.co/1600x500?text=Hero+Banner",
          placement: "HOMEPAGE_HERO",
          sortOrder: 0,
        },
        {
          title: "بنر تخفیف ویژه",
          imageUrl: "https://placehold.co/1200x300?text=Promo+Banner",
          placement: "HOMEPAGE_PROMO",
          sortOrder: 0,
        },
      ],
    });
  }

  console.log("✓ Content (Pages + Banners) seeded");
}

async function seedAppSettings() {
  await prisma.appSetting.upsert({
    where: { key: "site_name" },
    update: {},
    create: { key: "site_name", value: "فروشگاه من" },
  });

  await prisma.appSetting.upsert({
    where: { key: "support_email" },
    update: {},
    create: { key: "support_email", value: "support@yourdomain.com" },
  });

  console.log("✓ AppSettings seeded");
}

async function main() {
  console.log("🌱 شروع Seed کردن دیتابیس...\n");

  await seedUsers();
  const categories = await seedCategories();
  const brands = await seedBrands();
  const attributes = await seedAttributes();
  const tags = await seedTags();
  await seedProducts({ categories, brands, attributes, tags });
  await seedCoupons();
  await seedContent();
  await seedAppSettings();

  console.log(" Seed با موفقیت تمام شد.");
}

main()
  .catch((error) => {
    console.error("❌ خطا در Seed کردن دیتابیس:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
