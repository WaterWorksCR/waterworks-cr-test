"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiBox,
  FiMessageSquare,
  FiCheckCircle,
  FiPhone,
  FiMapPin,
  FiTruck,
  FiPackage,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { inputLimits } from "@/lib/api-schemas";
import type { OrderInput } from "@/lib/api-schemas";

const OrderSchema = Yup.object().shape({
  name: Yup.string()
    .max(inputLimits.name, "Name is too long")
    .required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .max(inputLimits.email, "Email is too long")
    .required("Email is required"),
  phone: Yup.string()
    .max(inputLimits.phone, "Phone number is too long")
    .required("Phone number is required"),
  service: Yup.string()
    .max(inputLimits.service, "Service is too long")
    .required("Please select a product or service"),
  deliveryMethod: Yup.string()
    .max(inputLimits.deliveryMethod, "Delivery method is too long")
    .required("Please select a delivery method"),
  address: Yup.string()
    .max(inputLimits.address, "Address is too long")
    .when("deliveryMethod", {
      is: "Delivery",
      then: (schema) => schema.required("An address is required for delivery"),
      otherwise: (schema) => schema.notRequired(),
    }),
  details: Yup.string()
    .max(inputLimits.details, "Details are too long")
    .required("Details are required"),
});

export default function OrdersPage() {
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik<OrderInput>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      deliveryMethod: "",
      address: "",
      details: "",
    },
    validationSchema: OrderSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const promise = fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      toast.promise(promise, {
        loading: "Submitting order...",
        success: () => {
          setSubmitted(true);
          resetForm();
          setSubmitting(false);
          return "Order submitted successfully!";
        },
        error: () => {
          setSubmitting(false);
          return "Failed to submit order.";
        },
      });
    },
  });

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-center mb-2 text-primary">
            Place Your Order
          </h1>
          <p className="text-center text-gray-400 mb-12">
            Fill out the form below to get started. We are ready to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-secondary p-8 rounded-xl shadow-2xl"
          >
            {submitted ? (
              <div className="text-center py-12">
                <FiCheckCircle className="mx-auto text-green-500 text-6xl mb-4" />
                <h2 className="text-2xl font-bold mb-2">Order Submitted!</h2>
                <p className="text-gray-400">
                  Thank you. We will be in touch shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 bg-primary text-white font-bold py-2 px-6 rounded-full hover:bg-blue-700 transition-colors"
                >
                  Place Another Order
                </button>
              </div>
            ) : (
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="relative">
                  <FiUser className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    placeholder="Full Name"
                    {...formik.getFieldProps("name")}
                    maxLength={inputLimits.name}
                    className={`w-full pl-10 pr-3 py-2 border-2 rounded-lg bg-background text-foreground focus:outline-none focus:border-primary ${
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
                <div className="relative">
                  <FiMail className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    placeholder="Email Address"
                    {...formik.getFieldProps("email")}
                    maxLength={inputLimits.email}
                    className={`w-full pl-10 pr-3 py-2 border-2 rounded-lg bg-background text-foreground focus:outline-none focus:border-primary ${
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
                <div className="relative">
                  <FiPhone className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Phone Number"
                    {...formik.getFieldProps("phone")}
                    maxLength={inputLimits.phone}
                    className={`w-full pl-10 pr-3 py-2 border-2 rounded-lg bg-background text-foreground focus:outline-none focus:border-primary ${
                      formik.touched.phone && formik.errors.phone
                        ? "border-red-500"
                        : "border-gray-700"
                    }`}
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.phone}
                    </div>
                  ) : null}
                </div>
                <div className="relative">
                  <FiBox className="absolute top-3 left-3 text-gray-400" />
                  <select
                    id="service"
                    {...formik.getFieldProps("service")}
                    className={`w-full pl-10 pr-3 py-2 border-2 rounded-lg bg-background text-foreground focus:outline-none focus:border-primary appearance-none ${
                      formik.touched.service && formik.errors.service
                        ? "border-red-500"
                        : "border-gray-700"
                    }`}
                  >
                    <option value="" disabled>
                      Select a Product or Service
                    </option>
                    <option value="Cases of Water">Cases of Water</option>
                    <option value="Gatorade">Gatorade</option>
                    <option value="Ice">Ice</option>
                    <option value="Water Softening Salt">Water Softening Salt</option>
                    <option value="Water Softeners">Water Softeners</option>
                    <option value="RO Systems">
                      Commercial & Residential RO Systems
                    </option>
                    <option value="Ice Machines">Ice Machines</option>
                    <option value="5 Gallon Water Jugs">5 Gallon Water Jugs</option>
                    <option value="System Maintenance">RO/Softener Maintenance</option>
                  </select>
                  {formik.touched.service && formik.errors.service ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.service}
                    </div>
                  ) : null}
                </div>

                {/* Delivery Method */}
                <div className="relative">
                  <p className="text-sm font-medium mb-2">Delivery Method</p>
                  <div className="flex space-x-4">
                    <label className="flex items-center p-3 border-2 border-gray-700 rounded-lg cursor-pointer flex-1 hover:border-primary">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="Pickup"
                        onChange={formik.handleChange}
                        className="hidden"
                      />
                      <FiPackage className="mr-2" />
                      <span>Pickup</span>
                    </label>
                    <label className="flex items-center p-3 border-2 border-gray-700 rounded-lg cursor-pointer flex-1 hover:border-primary">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="Delivery"
                        onChange={formik.handleChange}
                        className="hidden"
                      />
                      <FiTruck className="mr-2" />
                      <span>Delivery</span>
                    </label>
                  </div>
                  {formik.touched.deliveryMethod && formik.errors.deliveryMethod ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.deliveryMethod}
                    </div>
                  ) : null}
                </div>

                {/* Address Field - Conditional */}
                <AnimatePresence>
                  {formik.values.deliveryMethod === "Delivery" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      <FiMapPin className="absolute top-3 left-3 text-gray-400" />
                      <input
                        type="text"
                        id="address"
                        placeholder="Delivery Address"
                        {...formik.getFieldProps("address")}
                        maxLength={inputLimits.address}
                        className={`w-full pl-10 pr-3 py-2 border-2 rounded-lg bg-background text-foreground focus:outline-none focus:border-primary ${
                          formik.touched.address && formik.errors.address
                            ? "border-red-500"
                            : "border-gray-700"
                        }`}
                      />
                      {formik.touched.address && formik.errors.address ? (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.address}
                        </div>
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <FiMessageSquare className="absolute top-3 left-3 text-gray-400" />
                  <textarea
                    id="details"
                    placeholder="Project Details or Questions"
                    {...formik.getFieldProps("details")}
                    maxLength={inputLimits.details}
                    className={`w-full pl-10 pr-3 py-2 border-2 rounded-lg bg-background text-foreground focus:outline-none focus:border-primary ${
                      formik.touched.details && formik.errors.details
                        ? "border-red-500"
                        : "border-gray-700"
                    }`}
                    rows={5}
                  ></textarea>
                  {formik.touched.details && formik.errors.details ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.details}
                    </div>
                  ) : null}
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="w-full bg-primary text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    {formik.isSubmitting ? "Submitting..." : "Submit Order"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-secondary p-8 rounded-xl shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-primary mb-6">
              Why Choose Water Works C&R?
            </h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <FiCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span>
                  <span className="font-bold text-white">Wide Selection:</span> From
                  bottled water to advanced RO systems, we have it all.
                </span>
              </li>
              <li className="flex items-start">
                <FiCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span>
                  <span className="font-bold text-white">Expert Maintenance:</span> Keep
                  your systems running perfectly with our professional service.
                </span>
              </li>
              <li className="flex items-start">
                <FiCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span>
                  <span className="font-bold text-white">For Everyone:</span> We proudly
                  serve both commercial and residential clients.
                </span>
              </li>
              <li className="flex items-start">
                <FiCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span>
                  <span className="font-bold text-white">Local & Trusted:</span> Your
                  reliable community partner for all things water.
                </span>
              </li>
            </ul>
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-xl font-bold mb-4">Need Help?</h3>
              <p className="flex items-center text-gray-400 mb-2">
                <FiMapPin className="mr-3 text-primary" />
                2425 Stafford Blvd, Pecos, TX 79772
              </p>
              <p className="flex items-center text-gray-400">
                <FiPhone className="mr-3 text-primary" />
                +1 (432) 445-3306
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
