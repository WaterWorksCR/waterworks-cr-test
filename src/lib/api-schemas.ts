import { z } from "zod";

export const inputLimits = {
  name: 120,
  email: 254,
  phone: 40,
  service: 120,
  deliveryMethod: 40,
  address: 200,
  details: 2000,
  interest: 120,
  siteType: 120,
  message: 2000,
  adminNotes: 2000,
};

const trimmed = z.string().trim();
const trimmedMax = (max: number, message: string) =>
  trimmed.max(max, `${message} must be ${max} characters or less`);

export const orderStatusValues = [
  "new",
  "in_progress",
  "ready",
  "completed",
  "canceled",
] as const;
export const messageStatusValues = ["new", "responded", "archived"] as const;

export const orderStatusSchema = z.enum(orderStatusValues);
export const messageStatusSchema = z.enum(messageStatusValues);

const orderInputBaseSchema = z.object({
  name: trimmedMax(inputLimits.name, "Name").min(1, "Name is required"),
  email: trimmedMax(inputLimits.email, "Email")
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()),
  phone: trimmedMax(inputLimits.phone, "Phone number").min(
    1,
    "Phone number is required"
  ),
  service: trimmedMax(inputLimits.service, "Service").min(
    1,
    "Service is required"
  ),
  deliveryMethod: trimmedMax(
    inputLimits.deliveryMethod,
    "Delivery method"
  ).min(1, "Delivery method is required"),
  address: z
    .string()
    .trim()
    .max(inputLimits.address, "Address is too long")
    .optional()
    .transform((value) => (value ? value.trim() : undefined)),
  details: trimmedMax(inputLimits.details, "Details").min(
    1,
    "Details are required"
  ),
});

export const orderInputSchema = orderInputBaseSchema.refine(
  (data) =>
    data.deliveryMethod !== "Delivery" || (data.address && data.address.length > 0),
  {
    message: "Address is required for delivery",
    path: ["address"],
  }
);

export const orderRecordSchema = orderInputBaseSchema.safeExtend({
  id: z.number().int().positive(),
  createdAt: z.string(),
  status: orderStatusSchema,
  adminNotes: z.string(),
});

export const orderUpdateSchema = z
  .object({
    id: z.number().int().positive(),
    status: orderStatusSchema.optional(),
    adminNotes: z.string().max(inputLimits.adminNotes).optional(),
  })
  .refine((data) => data.status !== undefined || data.adminNotes !== undefined, {
    message: "No updates provided",
  });

export const messageInputSchema = z.object({
  name: trimmedMax(inputLimits.name, "Name").min(1, "Name is required"),
  email: trimmedMax(inputLimits.email, "Email")
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()),
  interest: trimmedMax(inputLimits.interest, "Consultation focus").min(
    1,
    "Consultation focus is required"
  ),
  siteType: trimmedMax(inputLimits.siteType, "Site type").min(
    1,
    "Site type is required"
  ),
  message: trimmedMax(inputLimits.message, "Message").min(
    1,
    "Message is required"
  ),
});

export const messageRecordSchema = messageInputSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.string(),
  status: messageStatusSchema,
  adminNotes: z.string(),
});

export const messageUpdateSchema = z
  .object({
    id: z.number().int().positive(),
    status: messageStatusSchema.optional(),
    adminNotes: z.string().max(inputLimits.adminNotes).optional(),
  })
  .refine((data) => data.status !== undefined || data.adminNotes !== undefined, {
    message: "No updates provided",
  });

export type OrderInput = z.infer<typeof orderInputSchema>;
export type OrderRecord = z.infer<typeof orderRecordSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export type MessageInput = z.infer<typeof messageInputSchema>;
export type MessageRecord = z.infer<typeof messageRecordSchema>;
export type MessageStatus = z.infer<typeof messageStatusSchema>;
