import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Phone, MapPin, Search, X, Printer, Share2, Send, Menu, Clock } from "lucide-react";
import { CATEGORIES, LOGO, PRODUCTS, STORE, hoursStatus, type ShowroomProduct as Product } from "@/lib/catalog";
import { useWishlist } from "@/lib/wishlist";

export function HoursBadge() {
  const [s, setS] = useState<{ open: boolean; label: string } | null>(null);
  useEffect(() => setS(hoursStatus()), []);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${s?.open ? "bg-success" : "bg-muted-foreground"}`} />
      {s?.label ?? "Open 7 days a week"}
    </span>
  );
}

export function Header() {
  const wl = useWishlist();
  const [menu, setMenu] = useState(false);
  const nav = [
    ...CATEGORIES.map((c) => ({ label: c.name.replace(" Suites", "").replace(" & Sleep Center", ""), to: "/showroom" as const, search: { category: c.slug } })),
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="bg-primary text-primary-foreground text-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2">
          <span>Free statewide Maine delivery on purchases $499+</span>
          <div className="flex items-center gap-4">
            <HoursBadge />
            <a href={`tel:${STORE.tel}`} className="hidden sm:inline font-semibold">{STORE.phone}</a>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4">
        <Link to="/" className="shrink-0"><img src={LOGO} alt="Dorsey Furniture" className="h-10 w-auto" /></Link>
        <nav className="hidden lg:flex items-center gap-5 text-sm">
          {nav.map((n) => (
            <Link key={n.label} to={n.to} search={n.search} className="hover:text-accent">{n.label}</Link>
          ))}
          <Link to="/brands" className="hover:text-accent">Brands</Link>
          <Link to="/visit" className="hover:text-accent">Visit</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <SearchBox />
          <button onClick={() => wl.setOpen(true)} className="relative rounded-full p-2 hover:bg-secondary" aria-label="Open showroom wishlist">
            <Heart className="h-5 w-5" />
            {wl.items.length > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">{wl.items.length}</span>}
          </button>
          <button className="lg:hidden p-2" onClick={() => setMenu(!menu)} aria-label="Menu"><Menu className="h-5 w-5" /></button>
        </div>
      </div>
      {menu && (
        <nav className="lg:hidden border-t border-border px-4 py-3 grid gap-3 text-sm" onClick={() => setMenu(false)}>
          {nav.map((n) => <Link key={n.label} to={n.to} search={n.search}>{n.label}</Link>)}
          <Link to="/brands">Brand Galleries</Link>
          <Link to="/financing">Financing</Link>
          <Link to="/visit">Visit the Showroom</Link>
        </nav>
      )}
    </header>
  );
}

function SearchBox() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const hits = q.length > 1 ? PRODUCTS.filter((p) => [p.name, p.brand, p.sub, p.sku].join(" ").toLowerCase().includes(q.toLowerCase())).slice(0, 6) : [];
  return (
    <div className="relative hidden md:block">
      <form onSubmit={(e) => { e.preventDefault(); navigate({ to: "/showroom", search: { q } }); setQ(""); }}>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sofas, Flexsteel, SKU…" className="w-64 rounded-full border border-input bg-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
      </form>
      {hits.length > 0 && (
        <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
          {hits.map((h) => (
            <Link key={h.slug} to="/product/$slug" params={{ slug: h.slug }} onClick={() => setQ("")} className="flex items-center gap-3 p-2 hover:bg-secondary">
              <img src={h.image} alt="" className="h-10 w-10 rounded object-contain" />
              <div className="text-sm"><div className="font-medium">{h.name}</div><div className="text-xs text-muted-foreground">{h.brand} · {h.sku}</div></div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const wl = useWishlist();
  const saved = wl.has(p.slug);
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-[var(--shadow-card)]">
      <Link to="/product/$slug" params={{ slug: p.slug }} className="block">
        <div className="aspect-square overflow-hidden bg-card p-4">
          <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{p.brand} · {p.sub}</div>
          <h3 className="mt-1 font-display text-lg leading-snug">{p.name}</h3>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="font-medium text-accent">Request price & availability</span>
            <span className="text-xs text-muted-foreground">{p.sku}</span>
          </div>
        </div>
      </Link>
            <button onClick={() => wl.toggle(p.slug)} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"} className="absolute right-3 top-3 rounded-full bg-card/90 p-2 shadow">
        <Heart className={`h-4 w-4 ${saved ? "fill-accent text-accent" : ""}`} />
      </button>
    </div>
  );
}

export function WishlistDrawer() {
  const wl = useWishlist();
  const items = PRODUCTS.filter((p) => wl.items.includes(p.slug));
  if (!wl.open) return null;
  const summary = items.map((i) => `${i.name} (SKU ${i.sku})`).join("\n");
  const share = async () => {
    const text = `My Dorsey Furniture showroom wishlist:\n${summary}`;
    if (navigator.share) await navigator.share({ title: "Dorsey wishlist", text }).catch(() => {});
    else { await navigator.clipboard.writeText(text); alert("Wishlist copied to clipboard"); }
  };
  return (
    <div className="fixed inset-0 z-50 flex justify-end print:static">
      <div className="absolute inset-0 bg-foreground/40 print:hidden" onClick={() => wl.setOpen(false)} />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div><h2 className="font-display text-2xl">Showroom Wishlist</h2><p className="text-sm text-muted-foreground">Collect pieces to see in person.</p></div>
          <button onClick={() => wl.setOpen(false)} aria-label="Close" className="print:hidden"><X /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 && <p className="text-muted-foreground">Tap the heart on any piece to save it here.</p>}
          {items.map((i) => (
            <div key={i.slug} className="flex gap-3">
              <img src={i.image} alt="" className="h-20 w-20 rounded bg-card object-contain" />
              <div className="flex-1 text-sm">
                <Link to="/product/$slug" params={{ slug: i.slug }} onClick={() => wl.setOpen(false)} className="font-medium hover:underline">{i.name}</Link>
                <div className="text-muted-foreground">{i.brand} · SKU {i.sku}</div>
              </div>
              <button onClick={() => wl.toggle(i.slug)} className="text-muted-foreground print:hidden" aria-label="Remove"><X className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="border-t border-border p-5 space-y-2 print:hidden">
            <Link to="/quote" search={{ wishlist: true }} onClick={() => wl.setOpen(false)} className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-medium text-primary-foreground"><Send className="h-4 w-4" /> Send to our sales team</Link>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => window.print()} className="flex items-center justify-center gap-2 rounded-md border border-border py-2 text-sm"><Printer className="h-4 w-4" /> Print</button>
              <button onClick={share} className="flex items-center justify-center gap-2 rounded-md border border-border py-2 text-sm"><Share2 className="h-4 w-4" /> Share</button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

export function ContactStrip() {
  return (
    <div className="grid gap-2 sm:grid-cols-3 text-sm">
      <a href={`tel:${STORE.tel}`} className="flex items-center gap-2 rounded-md border border-border p-3 hover:bg-secondary"><Phone className="h-4 w-4 text-accent" /> Call {STORE.phone}</a>
      <div className="flex items-center gap-2 rounded-md border border-border p-3"><Clock className="h-4 w-4 text-accent" /><HoursBadge /></div>
      <a href={STORE.directions} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-md border border-border p-3 hover:bg-secondary"><MapPin className="h-4 w-4 text-accent" /> Directions</a>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <div className="inline-block rounded bg-card p-2"><img src={LOGO} alt="Dorsey Furniture" className="h-10 w-auto" /></div>
          <p className="mt-3 text-sm opacity-80">The Bangor area's oldest family-owned furniture store — serving Maine for over 50 years.</p>
        </div>
        <div className="text-sm space-y-2">
          <div className="font-semibold uppercase tracking-wider text-xs opacity-70">Shop</div>
          {CATEGORIES.map((c) => <Link key={c.slug} to="/showroom" search={{ category: c.slug }} className="block opacity-90 hover:opacity-100">{c.name}</Link>)}
        </div>
        <div className="text-sm space-y-2">
          <div className="font-semibold uppercase tracking-wider text-xs opacity-70">Store</div>
          <Link to="/brands" className="block">Brand Galleries</Link>
          <Link to="/financing" className="block">Financing</Link>
          <Link to="/quote" className="block">Request a Quote</Link>
          <Link to="/visit" className="block">Visit & Hours</Link>
        </div>
        <div className="text-sm space-y-2">
          <div className="font-semibold uppercase tracking-wider text-xs opacity-70">Visit</div>
          <p>{STORE.address}</p>
          <a href={`tel:${STORE.tel}`} className="block font-semibold">{STORE.phone}</a>
          <p className="opacity-80">Open 7 days a week</p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 py-5 text-center text-xs opacity-70">© {new Date().getFullYear()} Dorsey Furniture · Holden, Maine</div>
    </footer>
  );
}
