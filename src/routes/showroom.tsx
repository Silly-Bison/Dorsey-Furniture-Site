import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Search } from "lucide-react";
import { useState } from "react";
import { CATEGORIES, PRODUCTS, categoryName, filterProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/site";

const schema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
});

export const Route = createFileRoute("/showroom")({
  validateSearch: schema,
  head: () => ({
    meta: [
      { title: "Showroom Catalog | Dorsey Furniture" },
      { name: "description", content: "Search living room, dining, bedroom and mattress pieces by category or brand at Dorsey Furniture." },
      { property: "og:title", content: "Showroom Catalog | Dorsey Furniture" },
      { property: "og:description", content: "Browse recliners, sofas, dining sets and mattresses from top brands." },
    ],
  }),
  component: Showroom,
});

function Showroom() {
  const { q = "", category, brand } = Route.useSearch();
  const navigate = useNavigate({ from: "/showroom" });
  const set = (patch: Partial<z.infer<typeof schema>>) => navigate({ search: (s) => ({ ...s, ...patch }), replace: true });
  const results = filterProducts(q, category, brand);
  const brands = Array.from(new Set(PRODUCTS.map((p) => p.brand))).sort();
  const [limit, setLimit] = useState(36);
  const cat = CATEGORIES.find((c) => c.slug === category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-5xl">{cat ? cat.name : brand ? `${brand} Gallery` : "The Showroom"}</h1>
      {cat && <p className="mt-2 text-muted-foreground">{cat.subs.join(" · ")}</p>}
      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => set({ q: e.target.value || undefined })} placeholder="Instant search…" className="w-full rounded-md border border-input bg-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</div>
            <div className="flex flex-wrap gap-2 lg:flex-col">
              <Chip active={!category} onClick={() => set({ category: undefined })}>All</Chip>
              {CATEGORIES.map((c) => <Chip key={c.slug} active={category === c.slug} onClick={() => set({ category: c.slug })}>{c.name}</Chip>)}
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Brand</div>
            <div className="flex flex-wrap gap-2 lg:flex-col">
              <Chip active={!brand} onClick={() => set({ brand: undefined })}>All brands</Chip>
              {brands.map((b) => <Chip key={b} active={brand === b} onClick={() => set({ brand: b })}>{b}</Chip>)}
            </div>
          </div>
        </aside>
        <div>
          <p className="mb-4 text-sm text-muted-foreground">{results.length} piece{results.length === 1 ? "" : "s"}{category ? ` in ${categoryName(category)}` : ""}</p>
          {results.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-10 text-center">
              <p className="font-display text-2xl">More on our floor than online.</p>
              <p className="mt-2 text-muted-foreground">Our showroom carries far more than we can list. Ask us what's in stock.</p>
              <Link to="/quote" className="mt-4 inline-block rounded-md bg-primary px-5 py-2.5 text-primary-foreground">Ask our team</Link>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{results.slice(0, limit).map((p) => <ProductCard key={p.slug} p={p} />)}</div>
              {results.length > limit && <div className="mt-8 text-center"><button onClick={() => setLimit(limit + 36)} className="rounded-md border border-border px-6 py-3 font-medium hover:bg-secondary">Show more ({results.length - limit} left)</button></div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-md px-3 py-1.5 text-left text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>{children}</button>
  );
}
