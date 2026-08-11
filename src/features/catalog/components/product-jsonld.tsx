import type { ProductDetailDTO } from "../types/product.dto";

export function ProductJsonLd({ product }: { product: ProductDetailDTO }) {
  const variant = product.variants[0];
  const stock = variant?.stock ?? 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    offers: {
      "@type": "Offer",
      price: variant?.price,
      priceCurrency: "IRR",
      // قبلاً: stock ?? 0 > 0  → به‌خاطر اولویت عملگرها یعنی stock ?? (0 > 0)، نه (stock ?? 0) > 0
      availability: stock > 0 ? "InStock" : "OutOfStock",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}