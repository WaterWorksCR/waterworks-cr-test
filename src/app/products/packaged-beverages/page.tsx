"use client";
import { motion } from "framer-motion";
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
          <h2 className="text-3xl font-bold mb-4 text-primary">Quench Your Thirst</h2>
          <p className="mb-4 text-gray-400">
            We offer a wide variety of packaged beverages to keep you, your family, or your employees hydrated and refreshed. Our selection includes cases of purified bottled water, popular sports drinks like Gatorade, and large 5-gallon jugs for water coolers.
          </p>
          <p className="text-gray-400">
            Perfect for offices, events, or stocking up at home, our delivery service ensures you never run out. All our water products are sourced for purity and taste.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
