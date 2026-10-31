import { createFileRoute, Link } from "@tanstack/react-router";
import { BRANDS } from "@/lib/catalog";

export const Route = createFileRoute("/brands")({
  head: () => ({
    meta: [
      { title: "Signature Brand Galleries | Dorsey Furniture" },
      { name: "description", content: "Flexsteel's 3,500 sq ft gallery, Craftmaster, Daniel's Amish, Barcalounger, Liberty and Warehouse M in Holden, Maine." },
      { property: "og:title", content: "Brand Galleries | Dorsey Furniture" },
      { property: "og:description", content: "The brands Maine trusts, all under one roof in Holden." },
    ],
  }),
  component: Brands,
});

function Brands() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-display text-5xl">Signature brand galleries</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Including a dedicated 3,500 sq ft Flexsteel showroom — one of the largest in New England.</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {BRANDS.map((b) => (
          <Link key={b.name} to="/showroom" search={{ brand: b.name }} className="rounded-lg border border-border bg-card p-6 hover:shadow-[var(--shadow-card)]">
            <div className="grid h-20 place-items-center">{b.logo ? <img src={b.logo} alt={b.name} className="max-h-16 max-w-full object-contain" /> : <span className="font-display text-3xl">{b.name}</span>}</div>
            <div className="mt-4 font-semibold">{b.name}</div>
            <p className="text-sm text-muted-foreground">{b.note}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
