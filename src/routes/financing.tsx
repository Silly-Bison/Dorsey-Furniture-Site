import { createFileRoute, Link } from "@tanstack/react-router";
import { ContactStrip } from "@/components/site";

export const Route = createFileRoute("/financing")({
  head: () => ({
    meta: [
      { title: "Flexible Furniture Financing | Dorsey Furniture" },
      { name: "description", content: "Flexible financing options on furniture and mattresses at Dorsey Furniture in Holden, Maine." },
      { property: "og:title", content: "Financing | Dorsey Furniture" },
      { property: "og:description", content: "Bring home what you love with flexible payment options." },
    ],
  }),
  component: Financing,
});

function Financing() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-5xl">Flexible financing</h1>
      <p className="mt-4 text-lg text-muted-foreground">We offer financing options to help you furnish your home on a schedule that works for you. Our team will walk you through current plans and promotions in the showroom or by phone.</p>
      <div className="mt-8"><ContactStrip /></div>
      <Link to="/quote" className="mt-8 inline-block rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground">Ask about financing</Link>
    </div>
  );
}
