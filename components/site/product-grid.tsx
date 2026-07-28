import { productCategories } from "@/lib/data/site-content";
import type { ProductCardItem } from "@/lib/data/products";

type ProductGridProps = {
  items?: ProductCardItem[];
};

export function ProductGrid({ items = productCategories }: ProductGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((product) => (
        <article
          key={product.name}
          className="rounded-lg border border-black/10 bg-white p-5 shadow-sm"
        >
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="aspect-[4/3] w-full rounded-md object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-cinnabar/10 text-lg font-semibold text-cinnabar">
              {product.name.slice(0, 1)}
            </div>
          )}
          {product.category ? (
            <div className="mt-4 text-xs font-semibold text-cinnabar">
              {product.category}
            </div>
          ) : null}
          <h3 className={`${product.category ? "mt-1" : "mt-4"} text-lg font-semibold text-ink`}>
            {product.name}
          </h3>
          <p className="mt-3 text-sm leading-7 text-graphite/75">
            {product.description}
          </p>
        </article>
      ))}
    </div>
  );
}
