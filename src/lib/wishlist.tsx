import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Ctx = { items: string[]; toggle: (slug: string) => void; has: (slug: string) => boolean; clear: () => void; open: boolean; setOpen: (v: boolean) => void };
const WishCtx = createContext<Ctx | null>(null);
const KEY = "dorsey-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {}
  }, []);
  const save = (next: string[]) => {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };
  return (
    <WishCtx.Provider
      value={{
        items,
        toggle: (s) => save(items.includes(s) ? items.filter((x) => x !== s) : [...items, s]),
        has: (s) => items.includes(s),
        clear: () => save([]),
        open,
        setOpen,
      }}
    >
      {children}
    </WishCtx.Provider>
  );
}

export function useWishlist() {
  const c = useContext(WishCtx);
  if (!c) throw new Error("useWishlist outside provider");
  return c;
}
