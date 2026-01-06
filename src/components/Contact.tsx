"use client";
import { useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

const ContactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  interest: Yup.string().required("Please select a consultation focus"),
  siteType: Yup.string().required("Please select a site type"),
  message: Yup.string().required("Message is required"),
});

export default function Contact() {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      interest: "",
      siteType: "",
      message: "",
    },
    validationSchema: ContactSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const promise = fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      toast.promise(promise, {
        loading: "Sending message...",
        success: () => {
          resetForm();
          setSubmitting(false);
          return "Message sent successfully!";
        },
        error: () => {
          setSubmitting(false);
          return "Failed to send message.";
        },
      });
    },
  });

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative overflow-hidden bg-secondary py-20 text-white"
      id="contact"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(232,180,88,0.2),_transparent_55%)]" />
      <div className="container relative mx-auto px-4">
        <h2 className="text-center font-display text-4xl uppercase tracking-[0.2em] text-accent">
          Consultation Desk
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm uppercase tracking-[0.3em] text-white/70">
          Tell us what you need. We match the system, schedule, and service plan.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl bg-white/10 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur">
            <h3 className="text-xl font-semibold uppercase tracking-[0.2em] text-white/80">
              Request a Consultation
            </h3>
            <p className="mt-3 text-sm text-white/70">
              Share your usage, building type, and timeline. We will follow up
              with a custom recommendation.
            </p>
            <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...formik.getFieldProps("name")}
                  className={`mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent ${
                    formik.touched.name && formik.errors.name
                      ? "border-red-500"
                      : "border-white/15"
                  }`}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.name}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...formik.getFieldProps("email")}
                  className={`mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : "border-white/15"
                  }`}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.email}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="interest"
                  className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                >
                  Consultation Focus
                </label>
                <select
                  id="interest"
                  {...formik.getFieldProps("interest")}
                  className={`mt-2 w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-accent contact-select ${
                    formik.touched.interest && formik.errors.interest
                      ? "border-red-500"
                      : "border-white/20"
                  }`}
                >
                  <option value="" className="text-secondary">
                    Select a product or system
                  </option>
                  <option value="Water Softeners" className="text-secondary">
                    Water Softeners
                  </option>
                  <option value="Reverse Osmosis" className="text-secondary">
                    Reverse Osmosis
                  </option>
                  <option value="Ice Machines" className="text-secondary">
                    Ice Machines + Vending
                  </option>
                  <option value="Bulk Water Delivery" className="text-secondary">
                    Bulk Water Delivery
                  </option>
                  <option value="Salt Supply" className="text-secondary">
                    Salt Supply
                  </option>
                </select>
                {formik.touched.interest && formik.errors.interest ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.interest}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="siteType"
                  className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                >
                  Site Type
                </label>
                <select
                  id="siteType"
                  {...formik.getFieldProps("siteType")}
                  className={`mt-2 w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-accent contact-select ${
                    formik.touched.siteType && formik.errors.siteType
                      ? "border-red-500"
                      : "border-white/20"
                  }`}
                >
                  <option value="" className="text-secondary">
                    Select the location type
                  </option>
                  <option value="Residential" className="text-secondary">
                    Residential
                  </option>
                  <option value="Commercial" className="text-secondary">
                    Commercial
                  </option>
                  <option value="Industrial" className="text-secondary">
                    Industrial / Job Site
                  </option>
                  <option value="Hospitality" className="text-secondary">
                    Hospitality / Food Service
                  </option>
                </select>
                {formik.touched.siteType && formik.errors.siteType ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.siteType}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                >
                  Notes & Usage
                </label>
                <textarea
                  id="message"
                  {...formik.getFieldProps("message")}
                  rows={4}
                  className={`mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent ${
                    formik.touched.message && formik.errors.message
                      ? "border-red-500"
                      : "border-white/15"
                  }`}
                ></textarea>
                {formik.touched.message && formik.errors.message ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.message}
                  </div>
                ) : null}
              </div>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full rounded-full bg-accent py-3 text-sm font-semibold uppercase tracking-[0.2em] text-secondary transition hover:bg-[#f2c474] disabled:cursor-not-allowed disabled:bg-white/20"
              >
                {formik.isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
          <div className="space-y-8">
            <div className="rounded-3xl border border-white/15 bg-white/5 p-6">
              <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-white/70">
                Service Hours
              </h3>
              <p className="mt-3 text-2xl font-semibold text-white">
                Mon - Sat · 7AM - 6PM
              </p>
              <p className="mt-2 text-sm text-white/60">
                Emergency delivery and system troubleshooting available.
              </p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/5 p-6">
              <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-white/70">
                Contact Information
              </h3>
              <div className="mt-4 space-y-3 text-sm text-white/70">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                    Address
                  </p>
                  <p>2425 Stafford Blvd, Pecos, TX 79772</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                    Email
                  </p>
                  <p>contact@waterworkscr.com</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                    Phone
                  </p>
                  <p>+1 (432) 445-3306</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/5 p-6">
              <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-white/70">
                Follow Us
              </h3>
              <div className="mt-4 flex space-x-4 text-white/70">
                <a
                  href="#"
                  className="text-white/70 transition hover:text-accent"
                  aria-label="Facebook"
                >
                  <FaFacebook size={24} />
                </a>
                <a
                  href="#"
                  className="text-white/70 transition hover:text-accent"
                  aria-label="Twitter"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="#"
                  className="text-white/70 transition hover:text-accent"
                  aria-label="Instagram"
                >
                  <FaInstagram size={24} />
                </a>
            </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
