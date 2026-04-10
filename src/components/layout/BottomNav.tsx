"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/home", icon: "🏠", label: "Home" },
  { href: "/library", icon: "📚", label: "Library" },
  { href: "/timeline", icon: "🕐", label: "Timeline" },
  { href: "/circle", icon: "👨‍👩‍👧", label: "Circle" },
  { href: "/profile", icon: "👤", label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-cherish-300/30 safe-area-pb">
      <div className="max-w-lg mx-auto flex">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors ${
                active ? "text-cherish-500" : "text-cherish-900/40"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span
                className={`text-[10px] font-medium ${
                  active ? "text-cherish-500" : "text-cherish-900/40"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
