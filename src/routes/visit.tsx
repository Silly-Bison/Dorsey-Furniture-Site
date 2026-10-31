import { createFileRoute } from "@tanstack/react-router";
import { DAY_NAMES, HOURS, STORE } from "@/lib/catalog";
import { ContactStrip } from "@/components/site";

export const Route = createFileRoute("/visit")({
  head: () => ({
    meta: [
      { title: "Visit Our Holden Showroom | Dorsey Furniture" },
      { name: "description", content: "Open 7 days at 1031 Main Rd, Holden, ME. Call (207) 843-7300 or get directions." },
      { property: "og:title", content: "Visit Dorsey Furniture in Holden, Maine" },
      { property: "og:description", content: "Hours, directions and contact for our showroom." },
    ],
  }),
  component: Visit,
});

const fmt = (h: number) => `${h % 12 || 12}${h < 12 ? "am" : "pm"}`;

function Visit() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-5xl">Visit the showroom</h1>
      <p className="mt-3 text-muted-foreground">{STORE.address} · Open 7 days a week</p>
      <div className="mt-6"><ContactStrip /></div>
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-display text-2xl">Hours</h2>
          <dl className="mt-4 divide-y divide-border text-sm">
            {[1, 2, 3, 4, 5, 6, 0].map((d) => (
              <div key={d} className="flex justify-between py-2"><dt>{DAY_NAMES[d]}</dt><dd>{fmt(HOURS[d]![0])} – {fmt(HOURS[d]![1])}</dd></div>
            ))}
          </dl>
        </div>
        <iframe title="Map to Dorsey Furniture" className="h-80 w-full rounded-lg border border-border lg:h-full" loading="lazy" src="https://www.google.com/maps?q=1031+Main+Rd+Holden+ME+04429&output=embed" />
      </div>
    </div>
  );
}
