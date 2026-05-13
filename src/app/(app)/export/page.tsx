"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface BookOption {
  id: string; title: string; _count: { memories: number };
}

const formats = [
  { id: "pdf", icon: "📄", name: "Digital PDF", desc: "Download instantly. View on any device.", base: "$3.99", perPage: "" },
  { id: "softcover", icon: "📕", name: "Softcover Book", desc: "Matte finish. Ships in 5-7 business days.", base: "$19.99", perPage: "+ $0.50/page" },
  { id: "hardcover", icon: "📗", name: "Hardcover Book", desc: "Premium linen cover. Dust jacket. Ships 7-10 days.", base: "$34.99", perPage: "+ $0.75/page" },
];

export default function ExportPage() {
  const [books, setBooks] = useState<BookOption[]>([]);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [quote, setQuote] = useState<{ total: string; pageCount: number; discount: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [quoting, setQuoting] = useState(false);
  const [step, setStep] = useState(0); // 0=select book, 1=select format, 2=preview, 3=checkout

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then((data) => {
        setBooks(data.books || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function getQuote() {
    if (!selectedBook) return;
    setQuoting(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: selectedBook, format: selectedFormat, quality: "standard" }),
      });
      const data = await res.json();
      setQuote({ total: data.totalFormatted, pageCount: data.pageCount, discount: data.discount });
      setStep(2);
    } catch {
      alert("Failed to generate quote");
    } finally {
      setQuoting(false);
    }
  }

  const selectedBookData = books.find((b) => b.id === selectedBook);

  return (
    <div className="page-container pt-6 animate-in">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl font-bold text-cherish-900">Export & Print</h1>
        <Link href="/library" className="text-xs text-cherish-500 font-medium">← Library</Link>
      </div>
      <p className="text-xs text-cherish-900/45 mb-6">
        Turn your digital memories into something you can hold.
      </p>

      {/* Progress */}
      <div className="flex gap-1 mb-6">
        {["Select Book", "Choose Format", "Preview & Order"].map((s, i) => (
          <div key={s} className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium text-center transition-all ${
            i === step ? "bg-cherish-500 text-white" : i < step ? "bg-cherish-200 text-cherish-700" : "bg-cherish-100 text-cherish-900/25"
          }`}>
            {s}
          </div>
        ))}
      </div>

      {/* Step 0: Select Book */}
      {step === 0 && (
        <div className="animate-in">
          <p className="label-upper mb-3">Which book would you like to export?</p>
          {loading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="card animate-pulse"><div className="h-16 bg-cherish-100 rounded-xl" /></div>
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="card text-center py-8">
              <span className="text-3xl block mb-2">📚</span>
              <p className="text-sm text-cherish-900/50">No books with memories yet</p>
              <Link href="/home" className="btn-primary mt-3 inline-block text-sm">Create Memories First</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {books.map((book) => (
                <button
                  key={book.id}
                  onClick={() => { setSelectedBook(book.id); setStep(1); }}
                  className={`w-full card-hover flex items-center gap-3 !p-4 ${
                    selectedBook === book.id ? "!border-cherish-500" : ""
                  }`}
                >
                  <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-cherish-300 to-cherish-400 flex items-center justify-center text-xl shadow-sm">📖</div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-cherish-900">{book.title}</p>
                    <p className="text-[10px] text-cherish-900/40">{book._count.memories} pages</p>
                  </div>
                  <span className="text-cherish-900/15">›</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 1: Format */}
      {step === 1 && (
        <div className="animate-in">
          <p className="label-upper mb-3">Choose your format</p>
          <div className="space-y-3 mb-6">
            {formats.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFormat(f.id)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                  selectedFormat === f.id
                    ? "border-cherish-500 bg-cherish-50 shadow-md"
                    : "border-cherish-300/40 hover:border-cherish-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{f.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-cherish-900">{f.name}</p>
                    <p className="text-[10px] text-cherish-900/40">{f.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-cherish-900">{f.base}</p>
                    {f.perPage && <p className="text-[9px] text-cherish-900/35">{f.perPage}</p>}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="w-12 h-12 rounded-xl border border-cherish-300 flex items-center justify-center text-cherish-500">‹</button>
            <button onClick={getQuote} disabled={quoting} className="btn-primary flex-1">
              {quoting ? "Calculating..." : "Get Price →"}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Preview & Checkout */}
      {step === 2 && quote && (
        <div className="animate-in">
          <div className="card !p-6 text-center mb-6">
            <div className="w-20 h-28 rounded-lg bg-gradient-to-br from-cherish-200 to-cherish-400 mx-auto mb-4 flex items-center justify-center text-3xl shadow-lg">
              {selectedFormat === "pdf" ? "📄" : selectedFormat === "softcover" ? "📕" : "📗"}
            </div>
            <h2 className="font-display text-lg font-bold text-cherish-900 mb-1">{selectedBookData?.title}</h2>
            <p className="text-xs text-cherish-900/40 mb-4">
              {quote.pageCount} pages · {formats.find((f) => f.id === selectedFormat)?.name}
            </p>

            <div className="border-t border-cherish-300/20 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-cherish-900/50">Subtotal</span>
                <span className="font-medium text-cherish-900">{quote.total}</span>
              </div>
              {quote.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Pro discount ({quote.discount}%)</span>
                  <span className="font-medium text-green-600">Applied ✓</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold border-t border-cherish-300/20 pt-2">
                <span className="text-cherish-900">Total</span>
                <span className="text-cherish-500">{quote.total}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="w-12 h-12 rounded-xl border border-cherish-300 flex items-center justify-center text-cherish-500">‹</button>
            <button className="btn-primary flex-1 !bg-gradient-to-r !from-cherish-500 !to-cherish-600 text-base py-4">
              {selectedFormat === "pdf" ? "Download PDF →" : "Place Order →"}
            </button>
          </div>
          <p className="text-center text-[10px] text-cherish-900/25 mt-3">
            {selectedFormat === "pdf" ? "Instant download after payment" : "Printed & shipped by our partner. Tracking included."}
          </p>
        </div>
      )}

      <div className="bottom-nav-spacer" />
    </div>
  );
}
