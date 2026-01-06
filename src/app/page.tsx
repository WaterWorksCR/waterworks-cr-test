"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiDroplet,
  FiTool,
  FiTruck,
  FiShield,
  FiMapPin,
  FiZap,
} from "react-icons/fi";
import Contact from "@/components/Contact";
import ParticlesComponent from "@/components/Particles";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-secondary py-24 text-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(13,92,140,0.35),_transparent_55%)]" />
        <div className="absolute -top-32 right-0 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
        <ParticlesComponent />
        <div className="relative container mx-auto grid gap-10 px-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="text-left">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xs uppercase tracking-[0.4em] text-white/70"
            >
              West Texas water systems & supply
            </motion.p>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 font-display text-4xl uppercase tracking-[0.15em] text-white sm:text-5xl"
            >
              Water, ice, salt, and systems for West Texas.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 max-w-xl text-lg text-white/75"
            >
              Straightforward supply and service for homes, offices, and job
              sites.
            </motion.p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#consultations"
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-secondary transition hover:bg-[#f2c474]"
              >
                Schedule a Consultation
              </Link>
              <Link
                href="/orders"
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-accent hover:text-accent"
              >
                Place an Order
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <FiShield className="text-accent" /> Licensed system installs
              </div>
              <div className="flex items-center gap-2">
                <FiTruck className="text-accent" /> Delivery in 24-48 hours
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin className="text-accent" /> Serving Pecos & the Permian
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-[32px] border border-white/15 bg-white/10 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                What we stock
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                Packaged beverages, ice & salt, and water systems.
              </h3>
              <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm text-white/70">
                <p className="font-semibold text-white">Includes</p>
                <ul className="mt-2 list-disc space-y-2 pl-4 text-white/70">
                  <li>Packaged beverages & 5-gallon water</li>
                  <li>Ice & softening salt</li>
                  <li>Softener & RO systems</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Strip */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-mist py-12"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
            <div className="rounded-3xl bg-secondary p-6 text-white shadow-[0_20px_60px_rgba(11,36,56,0.2)]">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-accent">
                <FiTruck className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">
                Local & Reliable
              </h3>
              <p className="text-sm text-white/70">Fast turnaround on orders.</p>
            </div>
            <div className="rounded-3xl bg-secondary p-6 text-white shadow-[0_20px_60px_rgba(11,36,56,0.2)]">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-accent">
                <FiDroplet className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">
                Full Supply Line
              </h3>
              <p className="text-sm text-white/70">Water, ice, salt, systems.</p>
            </div>
            <div className="rounded-3xl bg-secondary p-6 text-white shadow-[0_20px_60px_rgba(11,36,56,0.2)]">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-accent">
                <FiTool className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">
                Service Support
              </h3>
              <p className="text-sm text-white/70">
                Installation and maintenance options.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Consultations */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-clay py-20"
        id="consultations"
      >
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-secondary/60">
                Consultations
              </p>
              <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.2em] text-secondary md:text-4xl">
                Product specialists for every system.
              </h2>
              <p className="mt-4 text-sm text-slate-600">
                Tell us what you need and we&rsquo;ll match the right product.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="#contact"
                  className="rounded-full bg-secondary px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-primary"
                >
                  Request Consultation
                </Link>
                <Link
                  href="/orders"
                  className="rounded-full border border-secondary/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-secondary transition hover:border-secondary/50"
                >
                  Order Supplies
                </Link>
              </div>
            </div>
            <div className="grid gap-6">
              {[
                {
                  title: "Packaged Beverages",
                  body: "Cases of water, sports drinks, and 5-gallon jugs.",
                },
                {
                  title: "Ice & Salt",
                  body: "Bulk ice and softening salt for business or home.",
                },
                {
                  title: "Water Systems",
                  body: "Softeners, RO systems, and ice machines.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-secondary/10 bg-white/70 p-6 shadow-[0_20px_60px_rgba(11,36,56,0.1)]"
                >
                  <h3 className="text-xl font-semibold text-secondary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Products & Services Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="py-20"
        id="products"
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-secondary/60">
              Products & Services
            </p>
            <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.2em] text-secondary md:text-4xl">
              Everything you need to stay supplied.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600">
              Stocked essentials and system installs.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <motion.div
              whileHover={{ y: -8 }}
              className="rounded-3xl border border-secondary/10 bg-mist/80 p-6 shadow-[0_20px_60px_rgba(11,36,56,0.08)]"
            >
              <h3 className="text-2xl font-semibold text-secondary">
                Packaged Beverages
              </h3>
              <p className="mt-3 text-sm text-slate-600">
                Cases of water, sports drinks, and 5‑gallon jugs for daily
                delivery.
              </p>
              <Link
                href="/products/packaged-beverages"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary"
              >
                Explore beverages <FiZap />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ y: -8 }}
              className="rounded-3xl border border-secondary/10 bg-mist/80 p-6 shadow-[0_20px_60px_rgba(11,36,56,0.08)]"
            >
              <h3 className="text-2xl font-semibold text-secondary">
                Ice & Salt
              </h3>
              <p className="mt-3 text-sm text-slate-600">
                Bulk ice and softening salt available for business and home use.
              </p>
              <Link
                href="/orders"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary"
              >
                Place supply order <FiZap />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ y: -8 }}
              className="rounded-3xl border border-secondary/10 bg-mist/80 p-6 shadow-[0_20px_60px_rgba(11,36,56,0.08)]"
            >
              <h3 className="text-2xl font-semibold text-secondary">
                Water Systems
              </h3>
              <p className="mt-3 text-sm text-slate-600">
                Softeners, RO systems, and ice machines sized to your needs.
              </p>
              <Link
                href="/products/water-systems"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary"
              >
                View systems <FiZap />
              </Link>
            </motion.div>
          </div>
          <div className="mt-12 rounded-[32px] bg-secondary px-8 py-10 text-white">
            <h3 className="font-display text-2xl uppercase tracking-[0.2em]">
              Maintenance Services
            </h3>
            <p className="mt-4 max-w-2xl text-sm text-white/70">
              Filter swaps and tune-ups to keep systems running.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-secondary py-16"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl uppercase tracking-[0.2em] text-white">
            Ready to place an order?
          </h2>
          <p className="mt-4 text-sm text-white/70">
            Tell us what you need and we will get you a quick response.
          </p>
          <Link
            href="/orders"
            className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-secondary transition hover:bg-[#f2c474]"
          >
            Start Your Order
          </Link>
        </div>
      </motion.section>

      <Contact />
    </>
  );
}
