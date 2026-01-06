"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function PackagedBeveragesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/" className="text-primary hover:underline mb-8 block">
          &larr; Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-8">Packaged Beverages</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-full overflow-hidden rounded-3xl border border-secondary/10 bg-mist/80 shadow-[0_20px_60px_rgba(11,36,56,0.12)]">
            <Image
              src="/packaged-beverages.svg"
              alt="Packaged beverages illustration"
              width={900}
              height={600}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg"
        >
          <h2 className="text-3xl font-bold mb-4 text-primary">Quench Your Thirst</h2>
          <p className="mb-4 text-gray-400">
            We offer a wide variety of packaged beverages to keep you, your family, or your employees hydrated and refreshed. Our selection includes cases of purified bottled water, popular sports drinks like Gatorade, and large 5-gallon jugs for water coolers.
          </p>
          <p className="text-gray-400">
            Perfect for offices, events, or stocking up at home, our delivery service ensures you never run out. All our water products are sourced for purity and taste.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/orders"
              className="rounded-full border border-primary/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary transition hover:border-primary hover:bg-primary hover:text-white"
            >
              Place an order
            </Link>
            <Link
              href="/"
              className="rounded-full border border-secondary/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-secondary transition hover:border-secondary/50"
            >
              Talk with a specialist
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
