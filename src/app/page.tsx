"use client";
import Link from "next/link";
import { motion } from "framer-motion";
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
            Your Premier Source for Commercial & Residential Water Solutions.
          </motion.p>
          <Link
            href="/orders"
            className="bg-black text-white font-bold py-3 px-6 rounded-full hover:bg-gray-800"
          >
            Place an Order
          </Link>
        </div>
      </motion.section>

      {/* About Us Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="py-20 bg-secondary"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
          <p className="max-w-3xl mx-auto text-center text-gray-400 mb-8">
            Water Works C&R is your one-stop shop for all commercial and residential water needs. We provide a wide range of products, from bottled water and Gatorade to advanced water softening and reverse osmosis systems. Our team is also dedicated to maintaining your water systems to ensure you always have the best quality water.
          </p>
          <div className="text-center">
            <Link href="/about" className="text-primary font-bold hover:underline">
              Learn More About Us &rarr;
            </Link>
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
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Products & Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-secondary p-6 rounded-lg shadow-md text-center"
            >
              <h3 className="text-2xl font-bold mb-4 text-primary">
                Packaged Beverages
              </h3>
              <p className="text-gray-400">
                Cases of water, Gatorade, and 5-gallon water jugs.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-secondary p-6 rounded-lg shadow-md text-center"
            >
              <h3 className="text-2xl font-bold mb-4 text-primary">Ice & Salt</h3>
              <p className="text-gray-400">
                Bulk ice and water softening salt for commercial and residential use.
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
                Water softeners, commercial & residential RO systems, and ice machines.
              </p>
            </motion.div>
          </div>
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold mb-4 text-primary">Maintenance Services</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We also provide expert maintenance for all commercial and residential RO systems and water softeners to keep them running efficiently.
            </p>
          </div>
        </div>
      </motion.section>
      <Contact />
    </>
  );
}
