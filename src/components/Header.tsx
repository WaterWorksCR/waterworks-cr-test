"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-secondary/95 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-xl font-semibold tracking-wide text-white sm:text-2xl"
        >
          <span className="font-display text-2xl uppercase tracking-[0.2em] text-accent">
            Water Works
          </span>
          <span className="ml-2 text-base font-medium text-white/80">
            C&R
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 md:flex">
          <Link href="/#consultations" className="transition hover:text-white">
            Consultations
          </Link>
          <Link href="/orders" className="transition hover:text-white">
            Order Placement
          </Link>
          <Link
            href="/products/packaged-beverages"
            className="transition hover:text-white"
          >
            Packaged Beverages
          </Link>
          <Link
            href="/products/water-systems"
            className="transition hover:text-white"
          >
            Water Systems
          </Link>
          <Link href="/#products" className="transition hover:text-white">
            Services
          </Link>
          <Link href="/#contact" className="transition hover:text-white">
            Contact
          </Link>
        </nav>
        <div className="hidden md:flex">
          <Link
            href="/orders"
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-secondary transition hover:bg-[#f2c474]"
          >
            Place Order
          </Link>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      <div
        id="mobile-menu"
        className={`md:hidden ${
          menuOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden border-t border-white/10 bg-secondary/95 transition-all duration-300`}
      >
        <nav className="container mx-auto flex flex-col gap-4 px-4 py-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
          <Link
            href="/#consultations"
            className="transition hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Consultations
          </Link>
          <Link
            href="/orders"
            className="transition hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Order Placement
          </Link>
          <Link
            href="/products/packaged-beverages"
            className="transition hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Packaged Beverages
          </Link>
          <Link
            href="/products/water-systems"
            className="transition hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Water Systems
          </Link>
          <Link
            href="/#products"
            className="transition hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            href="/#contact"
            className="transition hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
          <Link
            href="/orders"
            className="mt-2 inline-flex w-fit rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary"
            onClick={() => setMenuOpen(false)}
          >
            Place Order
          </Link>
        </nav>
      </div>
    </header>
  );
}
