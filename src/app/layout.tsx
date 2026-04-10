import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Cherish — The moments pass. The memories don't have to.",
    template: "%s | Cherish",
  },
  description:
    "A privacy-first digital memory keeping app that combines scrapbooking, journaling, and family sharing into one beautiful experience.",
  keywords: [
    "scrapbook",
    "journal",
    "diary",
    "memory",
    "family",
    "photos",
    "private",
    "digital scrapbooking",
  ],
  openGraph: {
    title: "Cherish",
    description: "The moments pass. The memories don't have to.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#c84820",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-cherish-50">{children}</body>
    </html>
  );
}
