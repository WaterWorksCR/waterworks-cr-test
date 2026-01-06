"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function WaterSystemsPage() {
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
        <h1 className="text-4xl font-bold mb-8">Water Systems</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-full overflow-hidden rounded-3xl border border-secondary/10 bg-mist/80 shadow-[0_20px_60px_rgba(11,36,56,0.12)]">
            <Image
              src="/water-systems.svg"
              alt="Water systems illustration"
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
          <h2 className="text-3xl font-bold mb-4 text-primary">Advanced Water Treatment</h2>
          <p className="mb-4 text-gray-400">
            Upgrade your home or business with our state-of-the-art water systems. We specialize in water softeners to combat hard water issues, and high-efficiency reverse osmosis (RO) systems for the purest drinking water right from your tap.
          </p>
          <p className="mb-4 text-gray-400">
            Our solutions are tailored for both commercial and residential applications, ensuring optimal performance and water quality. We also offer professional installation and maintenance services.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/orders"
              className="rounded-full border border-primary/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary transition hover:border-primary hover:bg-primary hover:text-white"
            >
              Start an order
            </Link>
            <Link
              href="/"
              className="rounded-full border border-secondary/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-secondary transition hover:border-secondary/50"
            >
              Schedule a consult
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
