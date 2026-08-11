import type { ProductImageDTO } from "../types/product-image.dto";

export function ImagesList({ images }: { images: ProductImageDTO[] }) {
  if (images.length === 0) {
    return <p className="text-sm text-[var(--color-muted-foreground)]">هنوز تصویری اضافه نشده است.</p>;
  }
  return (
    <div className="flex flex-wrap gap-3">
      {images.map((img) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={img.id} src={img.url} alt={img.altText ?? ""} className="w-20 h-20 rounded-[var(--radius)] object-cover border border-[var(--color-border)]" />
      ))}
    </div>
  );
}