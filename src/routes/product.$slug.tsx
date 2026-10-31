import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, MessageSquare, Truck } from "lucide-react";
import { useState } from "react";
import { PRODUCTS, categoryName, findProduct } from "@/lib/catalog";
import { ContactStrip, ProductCard } from "@/components/site";
import { useWishlist } from "@/lib/wishlist";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = findProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return { meta: [{ title: "Piece not found | Dorsey Furniture" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${p.name} by ${p.brand} | Dorsey Furniture` },
        { name: "description", content: `${p.description} See it at our Holden, Maine showroom.` },
        { property: "og:title", content: `${p.name} | Dorsey Furniture` },
        { property: "og:description", content: p.description },
        { property: "og:image", content: p.image },
        { name: "twitter:image", content: p.image },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const wl = useWishlist();
  const saved = wl.has(p.slug);
  const [img, setImg] = useState(0);
  const related = PRODUCTS.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 4);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="text-sm text-muted-foreground">
        <Link to="/showroom">Showroom</Link> / <Link to="/showroom" search={{ category: p.category }}>{categoryName(p.category)}</Link> / {p.sub}
      </nav>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="rounded-lg border border-border bg-card p-6">
            <img src={p.images[img] ?? p.image} alt={p.name} className="mx-auto aspect-square w-full object-contain" />
          </div>
          {p.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {p.images.map((src, i) => (
                <button key={src} onClick={() => setImg(i)} className={`h-20 w-20 overflow-hidden rounded border bg-card p-1 ${i === img ? "border-accent" : "border-border"}`}>
                  <img src={src} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <Link to="/showroom" search={{ brand: p.brand }} className="text-sm uppercase tracking-wider text-accent">{p.brand}</Link>
          <h1 className="mt-2 font-display text-5xl leading-tight">{p.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">SKU {p.sku}</p>
          <p className="mt-5 leading-relaxed text-muted-foreground">{p.description || "Ask our team for full details on this piece."}</p>

          <div className="mt-8 grid gap-3">
            <Link to="/quote" search={{ sku: p.sku }} className="flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-4 font-medium text-primary-foreground">
              <MessageSquare className="h-5 w-5" /> Check Availability & Price Quote
            </Link>
            <button onClick={() => wl.toggle(p.slug)} className="flex items-center justify-center gap-2 rounded-md border border-border px-6 py-4 font-medium hover:bg-secondary">
              <Heart className={`h-5 w-5 ${saved ? "fill-accent text-accent" : ""}`} /> {saved ? "Saved to Showroom Wishlist" : "Add to Showroom Wishlist"}
            </button>
          </div>
          <div className="mt-4"><ContactStrip /></div>

          <div className="mt-8 flex gap-3 rounded-lg bg-secondary p-4 text-sm">
            <Truck className="h-5 w-5 shrink-0 text-accent" />
            <span>Free delivery anywhere in Maine on purchases of $499 or more, by our own in-house team.</span>
          </div>

          <h2 className="mt-8 font-display text-2xl">Details</h2>
          <dl className="mt-3 divide-y divide-border border-y border-border text-sm">
            {[["Brand", p.brand], ["Collection", p.sub], ...p.specs].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2.5"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
            ))}
          </dl>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-3xl">You may also like</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.slug} p={r} />)}</div>
        </section>
      )}
    </div>
  );
}
