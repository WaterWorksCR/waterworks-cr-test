"use client";
import { motion } from "framer-motion";
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
          <div className="w-full h-96 bg-secondary rounded-lg shadow-md flex items-center justify-center">
            <p className="text-gray-500">Image Placeholder</p>
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
        </motion.div>
      </div>
    </div>
  );
}
