"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiAward, FiTarget, FiUsers, FiEye } from "react-icons/fi";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "John Doe",
      role: "Founder & CEO",
      image: "/placeholder-person.jpg",
    },
    {
      name: "Jane Smith",
      role: "Head of Operations",
      image: "/placeholder-person.jpg",
    },
    {
      name: "Peter Jones",
      role: "Lead Technician",
      image: "/placeholder-person.jpg",
    },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-secondary text-white text-center py-20"
      >
        <div className="container mx-auto px-4 z-10">
          <h1 className="text-5xl font-bold mb-4">About Water Works C&R</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Your trusted partner for comprehensive water solutions, from pure drinking water to advanced system maintenance.
          </p>
        </div>
      </motion.section>

      {/* Our Story Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="py-20"
      >
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="w-full h-80 bg-primary rounded-lg shadow-md flex items-center justify-center">
            <p className="text-gray-200 text-2xl">Company History Placeholder</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4 flex items-center"><FiAward className="mr-3 text-primary" /> Our Story</h2>
            <p className="text-gray-400 mb-4">
              Founded in Pecos, Texas, Water Works C&R started with a simple goal: to provide our community with reliable access to high-quality water products and services. We saw a need for a local, dedicated supplier that could handle everything from residential water softener salt delivery to complex commercial reverse osmosis system installations.
            </p>
            <p className="text-gray-400">
              Over the years, we've grown into a one-stop shop for all water-related needs, but our commitment to personalized service and community values has never wavered. We're proud to be a local business that our neighbors can depend on.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Mission and Vision Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="py-20 bg-secondary"
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center">
              <FiTarget className="text-5xl text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-400">
                To deliver superior water products and services that enhance the health and well-being of our customers, backed by unmatched reliability and a commitment to our community.
              </p>
            </div>
            <div className="text-center">
              <FiEye className="text-5xl text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-gray-400">
                To be the leading and most trusted water solutions provider in the region, known for our innovation, expertise, and unwavering dedication to customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center"><FiUsers className="mr-3 text-primary" /> Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-secondary p-6 rounded-lg shadow-md text-center"
              >
                <div className="w-32 h-32 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                   <p className="text-gray-200">Photo</p>
                </div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-primary">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="text-center pb-20">
        <Link href="/contact" className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition-colors">
            Get in Touch
        </Link>
      </div>
    </div>
  );
}
