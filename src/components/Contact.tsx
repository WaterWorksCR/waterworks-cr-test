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
  message: Yup.string().required("Message is required"),
});

export default function Contact() {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
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
      className="py-20 bg-secondary"
      id="contact"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
            <p className="text-gray-400 mb-4">
              Have a question or want to work with us? Fill out the form and
              we'll get back to you as soon as possible.
            </p>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...formik.getFieldProps("name")}
                  className={`w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    formik.touched.name && formik.errors.name
                      ? "border-red-500"
                      : "border-gray-700"
                  }`}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.name}
                  </div>
                ) : null}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...formik.getFieldProps("email")}
                  className={`w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : "border-gray-700"
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
                  htmlFor="message"
                  className="block text-sm font-medium"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  {...formik.getFieldProps("message")}
                  rows={4}
                  className={`w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    formik.touched.message && formik.errors.message
                      ? "border-red-500"
                      : "border-gray-700"
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
                className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
            <div className="text-gray-400 space-y-4">
              <div>
                <h4 className="font-bold">Address</h4>
                <p>2425 Stafford Blvd, Pecos, TX 79772</p>
              </div>
              <div>
                <h4 className="font-bold">Email</h4>
                <p>contact@waterworkscr.com</p>
              </div>
              <div>
                <h4 className="font-bold">Phone</h4>
                <p>+1(432)4453306</p>
              </div>
            </div>
            <h3 className="text-2xl font-bold mt-8 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-foreground hover:text-primary"
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="#"
                className="text-foreground hover:text-primary"
                aria-label="Twitter"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="#"
                className="text-foreground hover:text-primary"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
