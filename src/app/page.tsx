"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiDroplet, FiTool, FiTruck } from "react-icons/fi";
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
        className="relative bg-primary text-white text-center py-20"
      >
        <ParticlesComponent />
        <div className="relative container mx-auto px-4 z-10">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl font-bold mb-4"
          >
            Water Works C&R
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl mb-8"
          >
            Commercial and residential water solutions delivered fast and handled right.
          </motion.p>
          <Link
            href="/orders"
            className="bg-black text-white font-bold py-3 px-6 rounded-full hover:bg-gray-800"
          >
            Place an Order
          </Link>
        </div>
      </motion.section>

      {/* Why Choose Us Strip */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="py-12 bg-secondary"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-background/60 p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                <FiTruck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Local & Reliable</h3>
              <p className="text-gray-400">
                Same‑day or next‑day service across commercial and residential needs.
              </p>
            </div>
            <div className="bg-background/60 p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                <FiDroplet className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Full Supply Line</h3>
              <p className="text-gray-400">
                Water, ice, salt, and systems from a single trusted partner.
              </p>
            </div>
            <div className="bg-background/60 p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                <FiTool className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Service That Sticks</h3>
              <p className="text-gray-400">
                Maintenance plans that keep RO and softeners running clean.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <Contact />

      {/* Products & Services Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Products & Services
          </h2>
          <p className="max-w-2xl mx-auto text-center text-gray-400 mb-12">
            Stocked essentials and systems for homes, offices, and job sites.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-secondary p-6 rounded-lg shadow-md text-center"
            >
              <h3 className="text-2xl font-bold mb-4 text-primary">
                Packaged Beverages
              </h3>
              <p className="text-gray-400">
                Cases of water, sports drinks, and 5‑gallon jugs.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-secondary p-6 rounded-lg shadow-md text-center"
            >
              <h3 className="text-2xl font-bold mb-4 text-primary">Ice & Salt</h3>
              <p className="text-gray-400">
                Bulk ice and softening salt for businesses and homes.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-secondary p-6 rounded-lg shadow-md text-center"
            >
              <h3 className="text-2xl font-bold mb-4 text-primary">
                Water Systems
              </h3>
              <p className="text-gray-400">
                Softeners, RO systems, and ice machines sized to your needs.
              </p>
            </motion.div>
          </div>
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold mb-4 text-primary">Maintenance Services</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Preventative service keeps RO and softeners running efficiently year‑round.
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
        className="py-16 bg-secondary"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to place an order?</h2>
          <p className="text-gray-400 mb-6">
            Tell us what you need and we will get you a quick response.
          </p>
          <Link
            href="/orders"
            className="bg-primary text-white font-bold py-3 px-6 rounded-full hover:bg-blue-600"
          >
            Start Your Order
          </Link>
        </div>
      </motion.section>
    </>
  );
}
