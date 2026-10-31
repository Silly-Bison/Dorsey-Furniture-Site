import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { PRODUCTS, STORE } from "@/lib/catalog";
import { useWishlist } from "@/lib/wishlist";
import { ContactStrip } from "@/components/site";

export const Route = createFileRoute("/quote")({
  validateSearch: z.object({ sku: z.string().optional(), wishlist: z.boolean().optional() }),
  head: () => ({
    meta: [
      { title: "Check Availability & Request a Quote | Dorsey Furniture" },
      { name: "description", content: "Ask Dorsey Furniture about price, availability and delivery for any piece." },
      { property: "og:title", content: "Request a Quote | Dorsey Furniture" },
      { property: "og:description", content: "Get pricing and availability from our Holden, Maine sales team." },
    ],
  }),
  component: Quote,
});

const formSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().max(30).optional(),
  town: z.string().trim().max(100).optional(),
  items: z.string().trim().min(1, "Tell us which pieces").max(2000),
  message: z.string().trim().max(1000).optional(),
});

function Quote() {
  const { sku, wishlist } = Route.useSearch();
  const wl = useWishlist();
  const initial = wishlist
    ? PRODUCTS.filter((p) => wl.items.includes(p.slug)).map((p) => `${p.name} — SKU ${p.sku}`).join("\n")
    : (() => { const p = PRODUCTS.find((x) => x.sku === sku); return p ? `${p.name} — SKU ${p.sku}` : ""; })();
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const r = formSchema.safeParse(data);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErrors({});
    // TODO: deliver inquiries to the sales team (needs a backend + email).
    setDone(true);
  };

  const field = "w-full rounded-md border border-input bg-card px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring";
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <h1 className="font-display text-5xl">Check availability & price</h1>
        <p className="mt-3 text-muted-foreground">Our sales team will reply with pricing, stock and delivery timing — usually the same day.</p>
        {done ? (
          <div className="mt-8 rounded-lg border border-border bg-card p-8">
            <h2 className="font-display text-3xl">Thank you!</h2>
            <p className="mt-2">We've got your request. For a faster answer, call us at <a className="font-semibold text-accent" href={`tel:${STORE.tel}`}>{STORE.phone}</a>.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 grid gap-4 sm:grid-cols-2" noValidate>
            {[["name", "Name *"], ["email", "Email *"], ["phone", "Phone"], ["town", "Town (for delivery)"]].map(([n, l]) => (
              <label key={n} className="text-sm">{l}<input name={n} type={n === "email" ? "email" : "text"} className={`mt-1 ${field}`} />{errors[n!] && <span className="text-destructive text-xs">{errors[n!]}</span>}</label>
            ))}
            <label className="text-sm sm:col-span-2">Pieces you're interested in *<textarea name="items" defaultValue={initial} rows={4} className={`mt-1 ${field}`} />{errors["items"] && <span className="text-destructive text-xs">{errors["items"]}</span>}</label>
            <label className="text-sm sm:col-span-2">Questions (fabric, size, delivery…)<textarea name="message" rows={3} className={`mt-1 ${field}`} /></label>
            <button className="rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground sm:col-span-2">Send my request</button>
          </form>
        )}
      </div>
      <aside className="space-y-4">
        <h2 className="font-display text-2xl">Prefer to talk?</h2>
        <div className="[&>div]:grid-cols-1"><ContactStrip /></div>
        <p className="text-sm text-muted-foreground">{STORE.address}</p>
      </aside>
    </div>
  );
}
