"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/home", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/create/quick-snap", label: "", isFab: true },
  { href: "/circle", label: "Family" },
  { href: "/profile", label: "You" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb" style={{
      background: "var(--c-bg)",
      borderTop: "1px solid var(--c-line)",
    }}>
      <div style={{
        maxWidth: 480, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-around",
        padding: "8px 8px 22px",
      }}>
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");

          if (item.isFab) {
            return (
              <Link key="fab" href={item.href} style={{
                width: 52, height: 52, borderRadius: "50%",
                background: "var(--c-brand)", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 20px rgba(200,72,32,0.4), 0 2px 6px rgba(200,72,32,0.3)",
                marginTop: -18,
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </Link>
            );
          }

          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              padding: "4px 8px", minWidth: 50, textDecoration: "none",
            }}>
              <NavIcon name={item.label} active={active} />
              <span style={{
                fontSize: 9.5, fontWeight: 500,
                color: active ? "var(--c-brand)" : "var(--c-ink-4)",
              }}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? "var(--c-brand)" : "var(--c-ink-4)";
  const fill = active ? "var(--c-brand-tint)" : "none";
  const props = { width: 20, height: 20, viewBox: "0 0 24 24", fill, stroke, strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (name) {
    case "Home": return <svg {...props}><path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2z" /></svg>;
    case "Explore": return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M16 8l-2.5 5.5L8 16l2.5-5.5z" /></svg>;
    case "Family": return <svg {...props}><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" /><path d="M14.5 19c0-2 1.5-3.5 4-3.5" /></svg>;
    case "You": return <svg {...props}><circle cx="12" cy="8" r="4" /><path d="M4 20c1-4 4-6 8-6s7 2 8 6" /></svg>;
    default: return <svg {...props}><circle cx="12" cy="12" r="8" /></svg>;
  }
}
