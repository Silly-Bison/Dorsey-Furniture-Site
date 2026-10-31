import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, Award, Wrench, CreditCard, Star } from "lucide-react";
import { BANNERS, BRANDS, CATEGORIES, PRODUCTS } from "@/lib/catalog";
import { ContactStrip, ProductCard } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dorsey Furniture | Digital Showroom · Holden, Maine" },
      { name: "description", content: "Browse Flexsteel, Barcalounger, Liberty and more at the Bangor area's oldest family-owned furniture store. Free Maine delivery on $499+." },
      { property: "og:title", content: "Dorsey Furniture Digital Showroom" },
      { property: "og:description", content: "Family-owned in Holden, Maine for 50+ years. Browse, save favorites, and request a quote." },
      { property: "og:image", content: BANNERS.clearance },
      { name: "twitter:image", content: BANNERS.clearance },
    ],
  }),
  component: Index,
});

const TRUST = [
  { icon: Truck, title: "Free Statewide Delivery", text: "Anywhere in Maine on purchases $499+." },
  { icon: Award, title: "50+ Years Family-Owned", text: "The Bangor area's oldest furniture store." },
  { icon: Wrench, title: "In-House Delivery & Service", text: "Our own team, start to finish." },
  { icon: CreditCard, title: "Flexible Financing", text: "Options to fit your budget." },
];

// Placeholder testimonials — replace with real customer reviews.
const REVIEWS = [
  { name: "Linda M., Brewer", text: "They took the time to help us find the right recliner for my husband's back. Delivery crew was wonderful." },
  { name: "Tom R., Ellsworth", text: "Free delivery all the way to the coast, and they set everything up. Old-fashioned service you don't find anymore." },
  { name: "Sarah K., Bangor", text: "We tried every mattress in the Sleep Center with no pressure at all. We'll be back for a dining set." },
];

function Index() {
  return (
    <>
      <section className="relative">
        <Link to="/showroom" search={{ category: "clearance" }}>
          <img src={BANNERS.clearance} alt="Dorsey Furniture Clearance Sale 2026" className="w-full aspect-[3/1] object-cover" />
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 grid gap-8 lg:grid-cols-[1.2fr_1fr] items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Holden, Maine · Since the 1970s</p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl leading-[1.05]">Explore our showroom before you visit.</h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">Save the pieces you love, request a price quote, and come see them in person. No carts, no pressure — just real people who know furniture.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/showroom" className="rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground">Browse the showroom</Link>
            <Link to="/visit" className="rounded-md border border-border px-6 py-3 font-medium">Plan your visit</Link>
          </div>
        </div>
        <ContactStrip />
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.title} className="flex gap-3">
              <t.icon className="h-6 w-6 shrink-0 text-accent" />
              <div><div className="font-semibold">{t.title}</div><div className="text-sm text-muted-foreground">{t.text}</div></div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="font-display text-4xl">Shop by room</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((c) => {
            const img = PRODUCTS.find((p) => p.category === c.slug)?.image;
            return (
              <Link key={c.slug} to="/showroom" search={{ category: c.slug }} className="group overflow-hidden rounded-lg border border-border bg-card">
                <div className="aspect-[4/3] bg-card p-3">{img ? <img src={img} alt="" loading="lazy" className="h-full w-full object-contain transition-transform group-hover:scale-105" /> : <div className="grid h-full place-items-center font-display text-3xl text-accent">Save</div>}</div>
                <div className="p-4"><div className="font-display text-xl">{c.name}</div><div className="text-sm text-muted-foreground">{c.blurb}</div></div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between"><h2 className="font-display text-4xl">On the showroom floor</h2><Link to="/showroom" className="text-sm text-accent">View all →</Link></div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.slice(0, 8).map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 grid gap-6 md:grid-cols-[2fr_1fr]">
        <img src={BANNERS.priceMatch} alt="Dorsey Price Match Guarantee" loading="lazy" className="w-full rounded-lg object-cover" />
        <img src={BANNERS.delivery} alt="Free statewide delivery in Maine" loading="lazy" className="w-full rounded-lg object-cover aspect-square md:aspect-auto md:h-full" />
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <h2 className="font-display text-4xl">Signature brand galleries</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {BRANDS.map((b) => (
            <Link key={b.name} to="/showroom" search={{ brand: b.name }} className="grid h-28 place-items-center rounded-lg border border-border bg-card p-4 text-center hover:shadow-[var(--shadow-card)]">
              {b.logo ? <img src={b.logo} alt={b.name} loading="lazy" className="max-h-14 max-w-full object-contain" /> : <span className="font-display text-2xl">{b.name}</span>}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="font-display text-4xl">What our neighbors say</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="rounded-lg border border-border bg-card p-6">
              <div className="flex gap-0.5 text-accent">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <blockquote className="mt-3 font-display text-xl leading-snug">“{r.text}”</blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">— {r.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
